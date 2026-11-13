-- Prefix for account journals -------------------------------------------------
ALTER TABLE public.account_journals
  ADD COLUMN IF NOT EXISTS prefix text;

UPDATE public.account_journals
SET prefix = CASE name
  WHEN 'Penjualan' THEN 'INV'
  WHEN 'Pembelian' THEN 'PUR'
  WHEN 'Kas'       THEN 'CSH'
  WHEN 'Bank'      THEN 'BNK'
  ELSE 'JV'
END
WHERE prefix IS NULL OR btrim(prefix) = '';

ALTER TABLE public.account_journals
  ALTER COLUMN prefix SET DEFAULT 'JV';

ALTER TABLE public.account_journals
  DROP CONSTRAINT IF EXISTS account_journals_prefix_format;

ALTER TABLE public.account_journals
  ADD CONSTRAINT account_journals_prefix_format
  CHECK (prefix IS NULL OR prefix ~ '^[A-Za-z0-9]{1,10}$');

COMMENT ON COLUMN public.account_journals.prefix IS
  'Prefix nomor jurnal, mis. INV, PUR, JV.';

-- Generic document number sequence -------------------------------------------
-- One row per scope + prefix + period. The period is part of the primary key,
-- so a new month (or year) starts again from 1 without any reset job.
CREATE TABLE IF NOT EXISTS public.number_sequences (
  scope       text        NOT NULL,
  prefix      text        NOT NULL DEFAULT '',
  period      text        NOT NULL CHECK (period ~ '^\d{4}(-\d{2})?$'),
  last_number bigint      NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT number_sequences_pkey PRIMARY KEY (scope, prefix, period)
);

ALTER TABLE public.number_sequences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.number_sequences FROM PUBLIC, anon, authenticated;

COMMENT ON TABLE public.number_sequences IS
  'Counter nomor dokumen per scope + prefix + periode (YYYY atau YYYY-MM).';
COMMENT ON COLUMN public.number_sequences.scope IS
  'Konsumen sequence, mis. account_move, sales_invoice, purchase_order.';

-- Atomic increment. `ON CONFLICT DO UPDATE` locks the counter row until the
-- transaction ends, so concurrent callers never receive the same number.
CREATE OR REPLACE FUNCTION public.next_sequence(
  p_scope  text,
  p_prefix text,
  p_period text
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_value bigint;
BEGIN
  INSERT INTO public.number_sequences AS seq (scope, prefix, period, last_number)
  VALUES (p_scope, p_prefix, p_period, 1)
  ON CONFLICT (scope, prefix, period)
  DO UPDATE SET last_number = seq.last_number + 1,
                updated_at  = now()
  RETURNING last_number INTO v_value;

  RETURN v_value;
END;
$$;

REVOKE ALL ON FUNCTION public.next_sequence(text, text, text) FROM PUBLIC;

-- Account move numbering ------------------------------------------------------
-- Assign a number only on the draft -> posted transition, never overwrite an
-- existing (possibly manual) number.
CREATE OR REPLACE FUNCTION public.set_account_move_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_prefix text;
  v_period text;
  v_seq    bigint;
  v_number text;
BEGIN
  IF NEW.status <> 'posted'
     OR NEW.number IS NOT NULL
     OR (TG_OP = 'UPDATE' AND OLD.status = 'posted') THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(NULLIF(btrim(prefix), ''), 'JV')
  INTO v_prefix
  FROM public.account_journals
  WHERE id = NEW.journal_id;

  v_prefix := COALESCE(v_prefix, 'JV');
  v_period := to_char(NEW.date, 'YYYY-MM');

  -- Skip numbers that already exist (manual entries or imported data).
  LOOP
    v_seq := public.next_sequence('account_move', v_prefix, v_period);
    v_number := v_prefix || '-' || v_period || '-' || to_char(v_seq, 'FM000000');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.account_moves WHERE number = v_number
    );
  END LOOP;

  NEW.number := v_number;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_account_move_number() FROM PUBLIC;

DROP TRIGGER IF EXISTS set_account_move_number ON public.account_moves;
CREATE TRIGGER set_account_move_number
  BEFORE INSERT OR UPDATE OF status, number, date, journal_id ON public.account_moves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_account_move_number();

CREATE UNIQUE INDEX IF NOT EXISTS account_moves_number_key
  ON public.account_moves (number)
  WHERE number IS NOT NULL;