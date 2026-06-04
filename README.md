# Tricarrier Defensive Operations Portal

A cybersecurity-focused defensive operations and incident tracking portal built using HTML, CSS, JavaScript, Firebase, and Netlify.

---

# Overview

Tricarrier Defensive Operations Portal is a lightweight SOC/DFIR-style platform designed for:

- Incident Tracking
- Defensive Security Documentation
- MITRE ATT&CK Mapping
- Investigation Workflow Management
- Evidence Tracking
- Blue Team Reporting
- Cybersecurity Research Documentation

The project is designed as both:

- A learning/research platform
- A cybersecurity portfolio project

---

# Features

## Authentication Layer
- Secure login screen
- Session handling
- Logout functionality

---

## Incident Case Management
- Create investigation cases
- Edit case details
- Save investigation data
- Track incident severity
- Track investigation status

---

## MITRE ATT&CK Integration
Supports mapping:
- Credential Access
- Initial Access
- Persistence
- Discovery
- Lateral Movement
- Exfiltration
- and more...

---

## Investigation Components
Each case supports:

- Investigation Summary
- Timeline
- Checklist
- Analyst Assignment
- Raw Log Storage
- Network Topology Notes
- Evidence Attachments

---

## Dashboard Statistics
- Total Cases
- Open Cases
- Resolved Cases
- High Severity Cases

---

## Markdown Export
Export complete incident reports as:
- `.md` investigation files

---

# Technologies Used

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript

## Backend / Cloud
- Firebase Firestore
- Firebase Storage

## Hosting
- Netlify

---

# Project Structure

```txt
tricarrier-defensive-portal/
│
├── index.html
├── style.css
├── script.js
├── firebase.js
└── README.md
