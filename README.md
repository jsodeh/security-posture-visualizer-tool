# CyberGuard Risk Management Platform

**Live Demo**: [https://cyberguard-dashboard.netlify.app](https://cyberguard-dashboard.netlify.app)

CyberGuard is a comprehensive cybersecurity risk management and assessment platform designed to provide organizations with real-time visibility into their security posture, attack surface, and vulnerability landscape.

## 🛡️ Features

### Core Capabilities
- **Risk Score Calculation**: Dynamic risk assessment based on attack surface, vulnerabilities, and penetration test results
- **Attack Surface Management**: Comprehensive asset discovery and exposure tracking
- **Vulnerability Management**: Centralized vulnerability tracking with CVSS scoring and remediation workflows
- **Penetration Test Integration**: Professional-grade pentest result management with letter grading system
- **Security Trends Analysis**: Historical security posture tracking and trend visualization
- **Multi-tenant Architecture**: Organization-based data isolation and management

### Dashboard Components
- **Real-time Risk Metrics**: Live security score with trend indicators
- **Interactive Visualizations**: Charts and graphs for security data analysis
- **Vulnerability Distribution**: Severity-based vulnerability breakdown
- **Security Posture Radar**: Multi-dimensional security assessment
- **Asset Inventory**: Comprehensive IT asset tracking and monitoring

### Data Integration
- **Nmap XML Import**: Network discovery and port scanning results
- **Nessus File Support**: Professional vulnerability scanner integration
- **OpenVAS Compatibility**: Open-source vulnerability assessment tools
- **Custom Data Ingestion**: Flexible API for third-party security tools

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (optional - demo mode available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyberguard-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   ```bash
   # Create .env file for Supabase integration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the platform**
   - Open [http://localhost:8080](http://localhost:8080)
   - Use demo credentials or create a new account

## 📊 How to Use CyberGuard

### Getting Started

1. **Account Setup**
   - Navigate to the CyberGuard platform
   - Create an account with your organization details
   - Complete the initial security assessment

2. **Dashboard Overview**
   - **Risk Score Card**: View your current security posture (0-100 scale)
   - **Active Vulnerabilities**: Track open security issues requiring attention
   - **Attack Surface**: Monitor exposed assets and services
   - **Pentest Grade**: View latest penetration test results (A+ to F scale)

### Core Workflows

#### 1. Asset Management
- **View Assets**: Navigate to "Attack Surface" tab to see all discovered assets
- **Asset Details**: Click on any asset to view ports, services, and exposure metrics
- **Asset Categories**: Assets are automatically categorized (Web Apps, Network Services, Cloud Infrastructure, etc.)

#### 2. Vulnerability Management
- **View Vulnerabilities**: Go to "Vulnerabilities" tab for complete vulnerability inventory
- **Filter & Search**: Use severity filters and search to find specific vulnerabilities
- **Status Updates**: Mark vulnerabilities as "Resolved" or assign to team members
- **CVSS Scoring**: All vulnerabilities include industry-standard CVSS scores

#### 3. Penetration Testing
- **View Results**: "Pentest Results" tab shows all penetration test findings
- **Grade System**: Results displayed as letter grades (A+ to F) for easy understanding
- **Historical Tracking**: View trends across multiple penetration tests
- **Remediation Status**: Track progress on fixing identified issues

#### 4. Data Import
- **Upload Scans**: Click "Upload Scans" button in the main dashboard
- **Supported Formats**: 
  - Nmap XML files (.xml)
  - Nessus scan files (.nessus)
  - OpenVAS XML reports (.xml)
- **Automatic Processing**: Files are automatically parsed and integrated into the platform

### Advanced Features

#### Risk Calculation
- **Automatic Scoring**: Risk scores are calculated using weighted algorithms
- **Components**: 
  - Attack Surface Score (30% weight)
  - Vulnerability Score (40% weight)
  - Penetration Test Score (30% weight)
- **Recalculation**: Click "Recalculate" to update scores with latest data

#### Reporting
- **Executive Summary**: High-level security posture overview
- **Technical Reports**: Detailed vulnerability and asset information
- **Compliance Reports**: Industry-standard compliance reporting
- **Export Options**: PDF and CSV export capabilities

#### Organization Management
- **Profile Settings**: Update organization details and contact information
- **User Management**: Add team members and assign roles
- **Security Settings**: Configure security policies and thresholds

### Best Practices

1. **Regular Scanning**: Upload new scan results weekly or after infrastructure changes
2. **Vulnerability Prioritization**: Focus on Critical and High severity vulnerabilities first
3. **Trend Monitoring**: Review security trends monthly to identify patterns
4. **Penetration Testing**: Conduct quarterly penetration tests for comprehensive assessment
5. **Team Collaboration**: Assign vulnerabilities to specific team members for accountability

### Troubleshooting

- **Upload Issues**: Ensure scan files are in supported formats (.xml, .nessus)
- **Missing Data**: Check that Supabase environment variables are configured correctly
- **Performance**: Large scan files may take several minutes to process
- **Browser Compatibility**: Use modern browsers (Chrome, Firefox, Safari, Edge)

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/UI**: High-quality, accessible UI component library
- **Recharts**: Professional data visualization and charting library
- **React Query**: Efficient data fetching and state management

### Backend Integration
- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Multi-tenant data isolation and security
- **RESTful APIs**: Clean, documented API endpoints
- **File Processing**: Client-side XML/Nessus file parsing

### Security Features
- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive activity tracking
- **HTTPS**: Secure communication protocols

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── ui/             # Base UI components (Shadcn)
│   └── upload/         # File upload components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
├── services/           # Business logic and API services
└── types/              # TypeScript type definitions
```

### Key Services
- **SecurityDataService**: Database operations and data management
- **RiskCalculationService**: Risk scoring algorithms and calculations
- **DataIngestionService**: File parsing and data import functionality

### Database Schema
- **organizations**: Multi-tenant organization management
- **assets**: IT asset inventory and tracking
- **vulnerabilities**: Security vulnerability management
- **risk_scores**: Historical risk assessment data
- **pentest_findings**: Penetration test results and findings

## 📈 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Configure build settings: `npm run build` with `dist` output directory
   - Set environment variables for Supabase integration

3. **Custom Domain** (Optional)
   - Configure custom domain in Netlify settings
   - Update DNS records to point to Netlify

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

We welcome contributions to the CyberGuard platform! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity (max 200 lines per file)
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow the existing code style and conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Comprehensive guides and API documentation
- **Issues**: GitHub Issues for bug reports and feature requests
- **Community**: Join our community discussions
- **Enterprise**: Contact us for enterprise support and custom implementations

---

**CyberGuard** - Empowering organizations with comprehensive cybersecurity risk management and assessment capabilities.