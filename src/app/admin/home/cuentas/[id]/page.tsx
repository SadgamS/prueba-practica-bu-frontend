'use client'
import Cuentas from '@/components/app/cuentas/Cuentas';
import { useParams } from 'next/navigation';

const CuentasClientesPage = () => {
  const params = useParams<{id: string}>();
  return (
    <>
      <Cuentas idCliente={params.id} />
    </>
  );
};
export default CuentasClientesPage;
