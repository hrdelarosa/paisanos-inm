import Image from 'next/image'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 self-center font-bold font-exo2 text-xl">
          <Image
            src="/paisanos.webp"
            alt="PaisanosInm Logo"
            className="rounded-4xl"
            width={180}
            height={180}
          />

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-medium">
              Sistema de Registro de Atenciones
            </span>

            <div className="text-xs font-medium text-muted-foreground uppercase">
              Oficina de Representación del INM Guerrero
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
