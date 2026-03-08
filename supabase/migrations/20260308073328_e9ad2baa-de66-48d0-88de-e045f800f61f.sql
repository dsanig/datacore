
CREATE TABLE public.ftp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT NOT NULL DEFAULT '',
  port TEXT NOT NULL DEFAULT '21',
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  remote_dir TEXT NOT NULL DEFAULT '/incoming',
  passive_mode BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pgp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  private_key TEXT NOT NULL DEFAULT '',
  passphrase TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS since this is an internal admin tool without auth
ALTER TABLE public.ftp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pgp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to ftp_settings" ON public.ftp_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to pgp_settings" ON public.pgp_settings FOR ALL USING (true) WITH CHECK (true);
