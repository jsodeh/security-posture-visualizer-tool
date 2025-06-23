# CyberGuard Platform - Client User Guide

**Welcome to CyberGuard** - Your comprehensive cybersecurity risk management solution.

**Live Platform**: [https://cyberguard-dashboard.netlify.app](https://cyberguard-dashboard.netlify.app)

## 🚀 Getting Started

### First Time Setup

1. **Access the Platform**
   - Navigate to [https://cyberguard-dashboard.netlify.app](https://cyberguard-dashboard.netlify.app)
   - You'll see the CyberGuard login screen with our shield logo

2. **Create Your Account**
   - Click the "Sign Up" tab
   - Enter your organization name (e.g., "Acme Corporation")
   - Provide your business email address
   - Create a secure password
   - Click "Create Account"

3. **Account Verification**
   - Check your email for verification (if required)
   - Return to the platform and sign in with your credentials

4. **Initial Dashboard**
   - Upon first login, you'll see the main CyberGuard dashboard
   - Demo data is pre-loaded to help you understand the platform

## 📊 Understanding Your Dashboard

### Main Dashboard Overview

When you log in, you'll see four key metric cards at the top:

#### 1. Risk Score (Left Card)
- **What it shows**: Your overall security posture (0-100 scale)
- **Color coding**: 
  - Green (80-100): Excellent security
  - Blue (60-79): Good security
  - Yellow (40-59): Needs improvement
  - Red (0-39): Critical attention required
- **Trend indicator**: Shows if your security is improving or declining

#### 2. Active Vulnerabilities
- **What it shows**: Number of unresolved security issues
- **Importance**: These require immediate attention
- **Trend**: Shows monthly change in vulnerability count

#### 3. Attack Surface
- **What it shows**: Total number of IT assets being monitored
- **Progress bar**: Percentage of assets with security coverage
- **Goal**: Aim for 100% asset coverage

#### 4. Pentest Grade
- **What it shows**: Letter grade from latest penetration test (A+ to F)
- **Industry standard**: Professional security assessment rating
- **Trend**: Shows improvement from previous tests

### Navigation Tabs

The platform has four main sections accessible via tabs:

## 📋 Tab 1: Overview

**Purpose**: High-level security summary and trends

### Key Components:

#### Risk Score Trend Chart
- **Timeline**: Shows your security score over the past 6 months
- **Blue line**: Your organization's risk score progression
- **Interpretation**: Upward trend = improving security

#### Vulnerability Distribution (Pie Chart)
- **Color coding**:
  - Red: Critical vulnerabilities (immediate action required)
  - Orange: High severity (address within 1 week)
  - Yellow: Medium severity (address within 1 month)
  - Green: Low severity (address as time permits)

#### Security Posture Radar
- **Six dimensions**: Shows strength across different security areas
- **Scale**: 0-100 for each security domain
- **Use case**: Identify which security areas need improvement

### How to Use Overview:
1. Check your risk trend - is it improving?
2. Review vulnerability distribution - focus on red/orange areas
3. Examine radar chart - identify weak security domains
4. Use insights to prioritize security investments

## 🎯 Tab 2: Attack Surface

**Purpose**: Understand what assets are exposed to potential attacks

### What You'll See:

#### Attack Surface Exposure Chart
- **Bar chart**: Shows exposure levels across different asset types
- **Red bars**: Exposed/vulnerable assets
- **Green bars**: Secured/protected assets
- **Goal**: Minimize red, maximize green

#### Asset Category Cards
Each card represents a type of IT asset:

- **Web Applications**: Your websites and web services
- **Network Services**: Servers, databases, internal systems
- **Cloud Infrastructure**: AWS, Azure, Google Cloud resources
- **Mobile Apps**: Company mobile applications
- **IoT Devices**: Internet-connected devices

#### For Each Asset Category:
- **Risk level badge**: Critical, High, Medium, or Low
- **Exposure percentage**: How much of this category is exposed
- **Asset count**: Number of assets in this category
- **Progress bar**: Visual representation of exposure level

### How to Use Attack Surface:
1. **Identify high-risk categories**: Look for "Critical" or "High" badges
2. **Prioritize by exposure**: Focus on categories with high exposure percentages
3. **Review asset counts**: Understand the scope of each category
4. **Take action**: Work with IT team to secure exposed assets

## 🔍 Tab 3: Pentest Results

**Purpose**: Review professional penetration testing findings and grades

### Main Components:

#### Latest Test Results Card
- **Overall grade**: Letter grade (A+ to F) for your security
- **Grade meaning**:
  - A+/A: Excellent security posture
  - B+/B: Good security with minor issues
  - C+/C: Adequate security, some concerns
  - D+/D: Poor security, significant issues
  - F: Critical security failures
- **Findings breakdown**: Count of Critical, High, Medium, Low issues
- **Download button**: Get full PDF report

#### Test Details Card
- **Test date**: When the assessment was performed
- **Testing company**: Which security firm conducted the test
- **Scope**: What systems were tested
- **Status**: Completion status of the test

#### Findings Trend Chart
- **Timeline**: Shows vulnerability discoveries across recent tests
- **Stacked bars**: Different colors for each severity level
- **Trend analysis**: Are findings decreasing over time?

#### Remediation Progress
- **Categories**: Different types of security issues
- **Progress bars**: Show fix status for each category
- **Color coding**:
  - Green: Fixed issues
  - Yellow: Work in progress
  - Red: Not yet addressed

#### Test History
- **Previous tests**: List of all past penetration tests
- **Grades**: Historical grade progression
- **Findings summary**: Quick overview of each test's results

### How to Use Pentest Results:
1. **Check your grade**: Understand your current security rating
2. **Review findings**: Focus on Critical and High severity issues first
3. **Track progress**: Monitor remediation efforts over time
4. **Plan next test**: Schedule regular penetration tests (quarterly recommended)

## ⚠️ Tab 4: Vulnerabilities

**Purpose**: Detailed vulnerability management and tracking

### Summary Cards (Top Row)
Four cards showing vulnerability counts by severity:
- **Critical**: Immediate action required (fix within 24-48 hours)
- **High**: Urgent attention needed (fix within 1 week)
- **Medium**: Important but not urgent (fix within 1 month)
- **Low**: Address when convenient (fix within 3 months)

### Vulnerability Table
Comprehensive list of all security vulnerabilities with:

#### Columns Explained:
- **CVE ID**: Official vulnerability identifier (e.g., CVE-2024-1234)
- **Title**: Human-readable vulnerability name
- **Severity**: Critical, High, Medium, or Low
- **CVSS**: Industry-standard severity score (0.0-10.0)
- **Status**: Open, In Progress, or Resolved
- **Assignee**: Team member responsible for fixing
- **Component**: Which system/application is affected
- **Discovered**: When the vulnerability was found
- **Actions**: Buttons to update status or assign

#### Search and Filter Tools:
- **Search box**: Find specific vulnerabilities by name or CVE ID
- **Severity filter**: Show only vulnerabilities of specific severity levels
- **Status filter**: View only open, in-progress, or resolved issues

### How to Use Vulnerabilities:
1. **Prioritize by severity**: Always address Critical and High first
2. **Assign ownership**: Use the assignee field to delegate responsibility
3. **Track progress**: Update status as work progresses
4. **Use search/filters**: Find specific vulnerabilities quickly
5. **Regular review**: Check this tab weekly to monitor progress

## 📤 Uploading Security Scan Data

### Supported File Types:
- **Nmap XML files** (.xml): Network discovery scans
- **Nessus files** (.nessus): Professional vulnerability scans
- **OpenVAS XML** (.xml): Open-source vulnerability assessments

### Upload Process:

1. **Click "Upload Scans"** (green button in top navigation)
2. **Drag and drop files** or click to select files
3. **Supported formats**: Only .xml and .nessus files are accepted
4. **File processing**: 
   - Files are automatically parsed
   - New assets and vulnerabilities are added to your inventory
   - Risk scores are recalculated
5. **Completion**: You'll see success messages for each processed file

### Best Practices for Uploads:
- **Regular uploads**: Upload new scans weekly or after infrastructure changes
- **File naming**: Use descriptive names (e.g., "web-servers-scan-2024-01.xml")
- **Scan coverage**: Ensure scans cover all critical assets
- **Validation**: Review uploaded data in the dashboard after processing

## 👤 Account Management

### User Menu (Top Right)
Click your email address to access:

#### Organization Settings
- **Company profile**: Update organization details
- **Contact information**: Maintain current contact data
- **Industry settings**: Specify your business sector
- **Company size**: Update employee count ranges

#### Account Options
- **Profile management**: Update personal information
- **Password changes**: Maintain account security
- **Sign out**: Securely log out of the platform

## 📊 Understanding Risk Calculations

### How CyberGuard Calculates Your Risk Score:

#### Components (Weighted Average):
1. **Attack Surface Score (30%)**: Based on asset exposure levels
2. **Vulnerability Score (40%)**: Based on unresolved security issues
3. **Penetration Test Score (30%)**: Based on professional security assessments

#### Scoring Logic:
- **Higher scores = Better security** (0-100 scale)
- **Automatic recalculation**: Scores update when new data is added
- **Historical tracking**: Previous scores are saved for trend analysis

#### Manual Recalculation:
- Click "Recalculate" button to update scores immediately
- Useful after uploading new scan data or resolving vulnerabilities

## 🎯 Best Practices for Using CyberGuard

### Daily Tasks (5 minutes):
1. Check main dashboard for any critical alerts
2. Review new vulnerabilities that may have been discovered
3. Update status on vulnerabilities being worked on

### Weekly Tasks (30 minutes):
1. Upload new security scan results
2. Review vulnerability assignments and progress
3. Check attack surface for new exposed assets
4. Update vulnerability statuses and assignments

### Monthly Tasks (1 hour):
1. Analyze security trends and risk score progression
2. Review penetration test remediation progress
3. Plan security improvements based on dashboard insights
4. Generate reports for management review

### Quarterly Tasks (2 hours):
1. Conduct comprehensive security posture review
2. Schedule next penetration test
3. Review and update organization security policies
4. Assess team training needs based on vulnerability patterns

## 🆘 Troubleshooting & Support

### Common Issues:

#### File Upload Problems:
- **Issue**: File won't upload
- **Solution**: Ensure file is .xml or .nessus format, check file size (<50MB)

#### Missing Data:
- **Issue**: Dashboard shows no data
- **Solution**: Upload scan files or contact support for data import

#### Slow Performance:
- **Issue**: Platform loads slowly
- **Solution**: Use modern browser, check internet connection, clear browser cache

#### Login Issues:
- **Issue**: Can't access account
- **Solution**: Reset password, check email verification, contact support

### Getting Help:
- **Documentation**: Comprehensive guides available in platform
- **Email Support**: Contact technical support team
- **Training**: Request user training sessions
- **Updates**: Platform automatically updates with new features

## 📈 Maximizing Value from CyberGuard

### For IT Teams:
- Use vulnerability data to prioritize security patches
- Leverage asset inventory for compliance reporting
- Track remediation progress with built-in workflows

### For Management:
- Monitor risk trends to assess security investment effectiveness
- Use executive dashboards for board reporting
- Track security posture improvements over time

### For Compliance:
- Generate reports for audit requirements
- Maintain historical security data
- Document vulnerability remediation efforts

---

**CyberGuard Support Team**  
For additional assistance, contact our support team or refer to the comprehensive documentation within the platform.

**Remember**: CyberGuard is designed to be your central hub for cybersecurity risk management. Regular use and data updates will provide the most accurate and valuable security insights for your organization.
