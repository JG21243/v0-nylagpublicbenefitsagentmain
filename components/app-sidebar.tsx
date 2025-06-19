"use client"

import { HelpCircle, Settings, Home, FileText, Calendar, MessageSquare } from "lucide-react"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { NylagLogo } from "@/components/ui/nylag-logo"
import { ChatHistory } from "@/components/sidebar-sections/chat-history"
import { ResearchTemplates } from "@/components/sidebar-sections/research-templates"

// Quick action items for common research topics
const quickActions = [
  {
    title: "SNAP Benefits",
    icon: Home,
    query: "What are the current SNAP eligibility requirements and work requirements for able-bodied adults?",
  },
  {
    title: "Medicaid Coverage",
    icon: FileText,
    query: "What Medicaid services are available for low-income families in New York State?",
  },
  {
    title: "Housing Assistance",
    icon: Calendar,
    query: "What are the eligibility requirements for Section 8 housing vouchers and public housing?",
  },
  {
    title: "SSI/SSDI Benefits",
    icon: MessageSquare,
    query: "What are the current SSI and SSDI application processes and eligibility criteria?",
  },
]

interface AppSidebarProps {
  currentSessionId?: string | null
  onSessionSelect?: (sessionId: string) => void
}

export function AppSidebar({ currentSessionId, onSessionSelect }: AppSidebarProps) {
  const handleQuickAction = (query: string) => {
    // Dispatch custom event to communicate with chat component
    window.dispatchEvent(new CustomEvent("insertQuery", { detail: { query } }))
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <NylagLogo className="text-lg" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-nylag-primary-blue">Research Agent</span>
            <span className="text-xs text-gray-500">Legal Research Tool</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Research Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleQuickAction(item.query)}
                    tooltip={item.query}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Research Templates Section */}
        <ResearchTemplates />

        {/* Chat History Section */}
        <ChatHistory currentSessionId={currentSessionId} onSessionSelect={onSessionSelect} />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
