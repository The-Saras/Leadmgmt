import { Response } from "express";
import { ILead } from "../types";

export const exportLeadsToCSV = (res: Response, leads: ILead[]): void => {
  const headers = ["Name", "Email", "Status", "Source", "Created At"];

  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=leads.csv"
  );
  res.status(200).send(csvContent);
};