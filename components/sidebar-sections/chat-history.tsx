"use client"

import type React from "react"

import { useState } from "react"
import { History, Trash2, Search, Archive, ArchiveRestore, Edit2 } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChatSessions } from "@/lib/hooks/use-chat-sessions"

interface ChatHistoryProps {
  currentSessionId?: string | null
  onSessionSelect?: (sessionId: string) => void
}

export function ChatHistory({ currentSessionId, onSessionSelect }: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [includeArchived, setIncludeArchived] = useState(false)
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const { sessions, loading, error, pagination, updateSession, deleteSession } = useChatSessions({
    search: searchTerm || undefined,
    includeArchived,
    limit: 10,
  })

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect?.(sessionId)
  }

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    if (confirm("Are you sure you want to delete this chat session?")) {
      try {
        await deleteSession(sessionId)
      } catch (error) {
        console.error("Failed to delete session:", error)
      }
    }
  }

  const handleArchiveSession = async (sessionId: string, archived: boolean, event: React.MouseEvent) => {
    event.stopPropagation()

    try {
      await updateSession(sessionId, { archived })
    } catch (error) {
      console.error("Failed to archive session:", error)
    }
  }

  const handleEditTitle = (sessionId: string, currentTitle: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingSession(sessionId)
    setEditTitle(currentTitle)
  }

  const handleSaveTitle = async (sessionId: string) => {
    if (editTitle.trim()) {
      try {
        await updateSession(sessionId, { title: editTitle.trim() })
        setEditingSession(null)
        setEditTitle("")
      } catch (error) {
        console.error("Failed to update session title:", error)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingSession(null)
    setEditTitle("")
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Chat History</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIncludeArchived(!includeArchived)}
          className="h-6 w-6 p-0"
          title={includeArchived ? "Hide archived" : "Show archived"}
        >
          {includeArchived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
        </Button>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        {/* Search Input */}
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 pl-7 text-xs"
            />
          </div>
        </div>

        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start text-gray-400">
                <History className="h-4 w-4" />
                <span>Loading...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : error ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start text-red-500">
                <History className="h-4 w-4" />
                <span>Error loading history</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : sessions.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled className="w-full justify-start text-gray-400">
                <History className="h-4 w-4" />
                <span>No chat history</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <div className="group flex items-center w-full">
                  <SidebarMenuButton
                    onClick={() => handleSessionClick(session.id)}
                    className={`flex-1 justify-start ${
                      currentSessionId === session.id ? "bg-nylag-primary-blue/10 text-nylag-primary-blue" : ""
                    } ${session.is_archived ? "opacity-60" : ""}`}
                    title={`${session.title} - ${new Date(session.created_at).toLocaleString()}`}
                  >
                    <History className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      {editingSession === session.id ? (
                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-6 text-xs flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveTitle(session.id)
                              } else if (e.key === "Escape") {
                                handleCancelEdit()
                              }
                            }}
                            onBlur={() => handleSaveTitle(session.id)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <span className="truncate text-xs font-medium">
                            {session.title.length > 35 ? `${session.title.substring(0, 35)}...` : session.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(session.created_at).toLocaleDateString()}
                            {session.is_archived && " (Archived)"}
                          </span>
                        </>
                      )}
                    </div>
                  </SidebarMenuButton>

                  {editingSession !== session.id && (
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditTitle(session.id, session.title, e)}
                        className="h-6 w-6 p-0 hover:bg-blue-100 flex-shrink-0"
                        title="Edit title"
                      >
                        <Edit2 className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleArchiveSession(session.id, !session.is_archived, e)}
                        className="h-6 w-6 p-0 hover:bg-yellow-100 flex-shrink-0"
                        title={session.is_archived ? "Restore" : "Archive"}
                      >
                        {session.is_archived ? (
                          <ArchiveRestore className="h-3 w-3 text-yellow-600" />
                        ) : (
                          <Archive className="h-3 w-3 text-yellow-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="h-6 w-6 p-0 hover:bg-red-100 flex-shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-2 pt-2 text-xs text-gray-500 text-center">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
