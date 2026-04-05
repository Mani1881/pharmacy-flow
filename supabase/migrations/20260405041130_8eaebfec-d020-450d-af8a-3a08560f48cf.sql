
DROP POLICY "Authenticated can insert sales" ON public.sales;
CREATE POLICY "Authenticated can insert own sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Authenticated can insert audit" ON public.audit_log;
CREATE POLICY "Authenticated can insert own audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
