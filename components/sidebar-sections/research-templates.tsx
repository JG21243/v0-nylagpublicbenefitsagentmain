"use client"

import { useState } from "react"
import { FileText, ChevronRight, ChevronDown, Plus } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useResearchTemplates, useTemplateCategories } from "@/lib/hooks/use-research-templates"

export function ResearchTemplates() {
  const [openSections, setOpenSections] = useState<string[]>([])
  const { templates, loading, error } = useResearchTemplates()
  const { categories } = useTemplateCategories()

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleTemplateClick = (query: string) => {
    window.dispatchEvent(new CustomEvent("insertQuery", { detail: { query } }))
  }

  // Group templates by category
  const templatesByCategory = templates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    },
    {} as Record<string, typeof templates>,
  )

  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Research Templates</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start">
                <FileText className="h-4 w-4" />
                <span>Loading templates...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  if (error) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Research Templates</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start text-red-500">
                <FileText className="h-4 w-4" />
                <span>Error loading templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Research Templates</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Add new template">
          <Plus className="h-3 w-3" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <Collapsible key={category} open={openSections.includes(category)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleSection(category)} className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{category}</span>
                      <span className="text-xs text-gray-500">({categoryTemplates.length})</span>
                    </div>
                    {openSections.includes(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {categoryTemplates.map((template) => (
                      <SidebarMenuSubItem key={template.id}>
                        <SidebarMenuSubButton
                          onClick={() => handleTemplateClick(template.query_template)}
                          className="text-xs"
                          title={`${template.title}\n\n${template.description || ""}\n\nQuery: ${template.query_template}`}
                        >
                          <span className="truncate">
                            {template.title.length > 40 ? `${template.title.substring(0, 40)}...` : template.title}
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}

          {Object.keys(templatesByCategory).length === 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start text-gray-400">
                <FileText className="h-4 w-4" />
                <span>No templates available</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
