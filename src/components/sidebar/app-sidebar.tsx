'use client'

import { ComponentProps } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ClipboardPenLineIcon,
  ClipboardPlusIcon,
  LogOutIcon,
  MilestoneIcon,
  SquareUserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import { useAuth } from '@/src/modules/login/hooks/useAuth'

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto p-2"
              render={<Link href="/" />}
            >
              <Image
                src="/paisanos-logo.webp"
                alt="Icono del Programa Heroínas y Héroes Paisanos"
                width={150}
                height={50}
                className="h-14 w-auto rounded-lg"
                loading="eager"
                unoptimized
              />
              <p className="text-lg font-semibold tracking-tight leading-5">
                Héroes Paisanos
              </p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Atenciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/attentions/new" />}>
                  <ClipboardPlusIcon />
                  <span className="font-medium">Registro</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/attentions" />}
                  // isActive={isActive(route.href)}
                  // tooltip={route.label}
                >
                  <ClipboardPenLineIcon />
                  <span className="font-medium">Atenciones</span>
                  {/* <Link
                  href={route.href}
                  className="text-lg font-semibold font-exo2"
                >
                  {route.icon && <route.icon />}
                  <span>{route.label}</span> */}
                  {/* </Link> */}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Adminstrador</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/admin/users" />}>
                  <UsersRoundIcon />
                  <span className="font-medium">Usuarios</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/admin/modules" />}>
                  <SquareUserRoundIcon />
                  <span className="font-medium">Modulos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/admin/operatives" />}>
                  <MilestoneIcon />
                  <span className="font-medium">Operativos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <NavMain /> */}
        {/* <NavSecondary className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="font-medium cursor-pointer hover:text-red-700"
              onClick={logout}
            >
              <LogOutIcon />
              Cerrar sesión
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
