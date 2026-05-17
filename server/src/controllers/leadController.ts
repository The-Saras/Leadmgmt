import { Response } from "express";
import Lead from "../models/Lead";
import {
  AuthRequest,
  ApiResponse,
  ILead,
  LeadQuery,
  LeadStatus,
  LeadSource,
} from "../types";
import { exportLeadsToCSV } from "../utils/csvExport";

// ----------------------------------------------------------------
// @route  POST /api/leads
// @access Private (admin + sales)
// ----------------------------------------------------------------
export const createLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({
        success: false,
        message: "Name, email and source are required",
      });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || "New",
      source,
      createdBy: req.user!.id,
    });

    const response: ApiResponse<ILead> = {
      success: true,
      message: "Lead created successfully",
      data: lead,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating lead",
    });
  }
};

// ----------------------------------------------------------------
// @route  GET /api/leads
// @access Private (admin + sales)
// ----------------------------------------------------------------
export const getLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filters
    const { status, source, search, sort } = req.query;

    const query: LeadQuery = {};

    if (status) {
      query.status = status as LeadStatus;
    }

    if (source) {
      query.source = source as LeadSource;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }

    // Sort — latest by default
    const sortOrder = sort === "oldest" ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email"),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<ILead[]> = {
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching leads",
    });
  }
};

// ----------------------------------------------------------------
// @route  GET /api/leads/:id
// @access Private (admin + sales)
// ----------------------------------------------------------------
export const getLeadById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    const response: ApiResponse<ILead> = {
      success: true,
      data: lead,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching lead",
    });
  }
};

// ----------------------------------------------------------------
// @route  PUT /api/leads/:id
// @access Private (admin + sales)
// ----------------------------------------------------------------
export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user!.role === "sales" &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      res.status(403).json({
        success: false,
        message: "You can only update your own leads",
      });
      return;
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source },
      { new: true, runValidators: true }
    );

    const response: ApiResponse<ILead> = {
      success: true,
      message: "Lead updated successfully",
      data: updatedLead!,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating lead",
    });
  }
};

// ----------------------------------------------------------------
// @route  DELETE /api/leads/:id
// @access Private (admin only)
// ----------------------------------------------------------------
export const deleteLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);

    const response: ApiResponse<null> = {
      success: true,
      message: "Lead deleted successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting lead",
    });
  }
};

// ----------------------------------------------------------------
// @route  GET /api/leads/export
// @access Private (admin only)
// ----------------------------------------------------------------
export const exportLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 });

    if (leads.length === 0) {
      res.status(404).json({
        success: false,
        message: "No leads found to export",
      });
      return;
    }

    exportLeadsToCSV(res, leads);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while exporting leads",
    });
  }
};