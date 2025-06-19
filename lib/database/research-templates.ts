import { sql } from "./connection"
import type { ResearchTemplate, ApiResponse, PaginatedResponse } from "./types"

export class ResearchTemplatesDB {
  // Create a new research template
  static async create(
    title: string,
    category: string,
    queryTemplate: string,
    description: string | null = null,
    isPublic = true,
    createdBy: string | null = null,
  ): Promise<ApiResponse<ResearchTemplate>> {
    try {
      const result = await sql`
        INSERT INTO research_templates (title, category, query_template, description, is_public, created_by)
        VALUES (${title}, ${category}, ${queryTemplate}, ${description}, ${isPublic}, ${createdBy})
        RETURNING *
      `

      return {
        success: true,
        data: result[0] as ResearchTemplate,
      }
    } catch (error) {
      console.error("Error creating research template:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create research template",
      }
    }
  }

  // Get all public templates or user's private templates
  static async getByCategory(
    category?: string,
    userId?: string,
    page = 1,
    limit = 50,
  ): Promise<PaginatedResponse<ResearchTemplate>> {
    try {
      const offset = (page - 1) * limit

      let whereClause = sql`WHERE (is_public = TRUE`
      if (userId) {
        whereClause = sql`WHERE (is_public = TRUE OR created_by = ${userId})`
      } else {
        whereClause = sql`WHERE is_public = TRUE`
      }

      if (category) {
        whereClause = sql`${whereClause} AND category = ${category}`
      }

      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as total 
        FROM research_templates 
        ${whereClause}
      `

      const total = Number.parseInt(countResult[0].total)

      // Get paginated results
      const templates = await sql`
        SELECT * FROM research_templates 
        ${whereClause}
        ORDER BY category, title
        LIMIT ${limit} OFFSET ${offset}
      `

      return {
        success: true,
        data: templates as ResearchTemplate[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      console.error("Error fetching research templates:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch research templates",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }
  }

  // Get all categories
  static async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const result = await sql`
        SELECT DISTINCT category 
        FROM research_templates 
        WHERE is_public = TRUE
        ORDER BY category
      `

      return {
        success: true,
        data: result.map((row) => row.category),
      }
    } catch (error) {
      console.error("Error fetching template categories:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch template categories",
        data: [],
      }
    }
  }

  // Update a research template
  static async update(
    templateId: string,
    updates: Partial<Pick<ResearchTemplate, "title" | "category" | "query_template" | "description" | "is_public">>,
  ): Promise<ApiResponse<ResearchTemplate>> {
    try {
      const setParts = []
      const values = []

      if (updates.title !== undefined) {
        setParts.push(`title = $${setParts.length + 1}`)
        values.push(updates.title)
      }
      if (updates.category !== undefined) {
        setParts.push(`category = $${setParts.length + 1}`)
        values.push(updates.category)
      }
      if (updates.query_template !== undefined) {
        setParts.push(`query_template = $${setParts.length + 1}`)
        values.push(updates.query_template)
      }
      if (updates.description !== undefined) {
        setParts.push(`description = $${setParts.length + 1}`)
        values.push(updates.description)
      }
      if (updates.is_public !== undefined) {
        setParts.push(`is_public = $${setParts.length + 1}`)
        values.push(updates.is_public)
      }

      if (setParts.length === 0) {
        return {
          success: false,
          error: "No updates provided",
        }
      }

      setParts.push(`updated_at = NOW()`)

      const result = await sql`
        UPDATE research_templates 
        SET ${sql.unsafe(setParts.join(", "))}
        WHERE id = ${templateId}
        RETURNING *
      `

      if (result.length === 0) {
        return {
          success: false,
          error: "Research template not found",
        }
      }

      return {
        success: true,
        data: result[0] as ResearchTemplate,
      }
    } catch (error) {
      console.error("Error updating research template:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update research template",
      }
    }
  }

  // Delete a research template
  static async delete(templateId: string, userId?: string): Promise<ApiResponse<void>> {
    try {
      let whereClause = sql`WHERE id = ${templateId}`
      if (userId) {
        whereClause = sql`WHERE id = ${templateId} AND created_by = ${userId}`
      }

      const result = await sql`
        DELETE FROM research_templates 
        ${whereClause}
        RETURNING id
      `

      if (result.length === 0) {
        return {
          success: false,
          error: "Research template not found or access denied",
        }
      }

      return {
        success: true,
        message: "Research template deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting research template:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete research template",
      }
    }
  }
}
