PART 1 — HR ADMIN SIDE (Create & Monitor)

Design an Announcements & Document Management section in the HR Admin dashboard. Use the existing navy blue (#1E2A4A) sidebar layout with white content area and #F7F8FA background.
Announcements Hub Page

A main page titled "Announcements & Policies" with two elements at the top right: a "+ Create New" dropdown button that expands into three options:

📢 Advisory
📄 Memorandum
📋 Policy

Below the button, show three tabs: All, Advisories, Memorandums, Policies. Each tab filters the content list below.
Content List Table

Columns: Title, Type (color-coded badge — blue for Advisory, purple for Memorandum, green for Policy), Date Published, Target Audience (All Employees / Managers Only / Specific Department), Status (Published / Draft / Archived), Read Rate (e.g., "18 / 24 read" shown as a mini progress bar), and Actions (View, Edit, Archive).
Create / Edit Form Modal

A full-page modal or slide-over panel with:

Document Type selector at the top (Advisory / Memorandum / Policy) — toggles the header label and color accent
Title field
Reference Number (auto-generated, editable) e.g., ADV-2025-001
Effectivity Date (date picker)
Target Audience (dropdown: All Employees, Managers Only, Specific Department — selecting "Specific Department" reveals a department multi-select)
Requires Acknowledgement toggle (on/off) — if ON, employees/managers must click "I have read and understood this" to confirm
Body / Content (rich text editor with bold, italic, bullet list, heading support)
Attach File option (PDF, DOCX) with upload button
Two action buttons at the bottom: "Save as Draft" (outlined) and "Publish" (filled navy blue)

Acknowledgement Tracker Page

Accessible by clicking the read rate badge or a "View Acknowledgements" button inside any published document. Shows:

Document title and type badge at the top
Summary row: Total Recipients, Read, Unread, Pending — shown as stat cards
A table below with columns: Employee Name, Department, Role, Date Read, Status (Read ✅ in green / Unread ❌ in red / Pending 🕐 in amber)
A "Send Reminder" button per unread row that sends a notification to that employee
A "Send Bulk Reminder" button at the top right that notifies all unread recipients at once
Export button (CSV) to download the acknowledgement report



PART 2 — MANAGER SIDE (View & Acknowledge)

Design the Announcements section for the Department Manager role. Use the same navy sidebar layout scoped to manager permissions.
Announcements Feed Page

A card-based feed layout showing all published advisories, memorandums, and policies addressed to the manager's department or all employees. Each card shows:

Color-coded left border: blue (Advisory), purple (Memorandum), green (Policy)
Document type badge top-left
Title in bold
Reference number and effectivity date in small gray text
Short excerpt of the content (2–3 lines)
"Read More" button (outlined navy blue)
Bottom-right status chip: "Acknowledged ✅" in green or "Action Required 🕐" in amber

A filter bar at the top: All, Unacknowledged, Advisories, Memorandums, Policies. Include a notification dot on the sidebar menu icon when there are unread items.
Document Detail View

Clicking "Read More" opens a full-page document view:

Header: Document type badge, Reference Number, Effectivity Date, Published by (HR Admin name)
Full rich text content body
Attached file download button if applicable
At the very bottom, an acknowledgement section (only visible if Requires Acknowledgement is ON):

Checkbox: "I have read and fully understood this document."
"Acknowledge" button in navy blue — becomes grayed out and replaced with a green "Acknowledged ✅ — [Date & Time]" confirmation chip once clicked
A note in small gray italic: "Your acknowledgement will be recorded and sent to HR."





PART 3 — EMPLOYEE SIDE (View & Acknowledge)

Design the Announcements section for the Employee role. Use the same card feed layout as the Manager side but scoped to employee-level documents only.
Announcements Feed Page

Same card-based feed as the Manager side. Show a prominent "You have [N] unread announcements" amber banner at the top if there are pending items requiring acknowledgement. Cards follow the same structure: color-coded border, type badge, title, excerpt, "Read More" button, and acknowledgement status chip.
Document Detail View

Same as the Manager detail view:

Full document content
Attached file download button
Acknowledgement section at the bottom with checkbox and "Acknowledge" button
Once acknowledged, show: "Acknowledged ✅ — [Date & Time]" in green
If already acknowledged on a previous visit, the button is permanently disabled and shows the acknowledgement timestamp

Also add a notification bell icon in the top header bar that shows a red dot badge when a new advisory, memorandum, or policy has been published. Clicking the bell opens a notification dropdown showing the latest 5 announcements with their type, title, and time posted. Each item is clickable and navigates directly to the document detail view.