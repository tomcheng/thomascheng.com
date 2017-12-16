import React from "react";
import styled from "styled-components";
import OriginalSectionTitle from "../common/SectionTitle";

const WORK_HISTORY = [
  {
    role: "Senior Developer (Full Stack)",
    company: "LookBookHQ",
    start: "February 2016",
    end: null,
    details: [
      "Architected the frontend of a revamped version of LookBookHQ's platform",
      "Created the data processing pipeline with Elixir, using the Event Sourcing pattern",
      "Worked with Ruby and Ruby on Rails for the backend"
    ]
  },
  {
    role: "Frontend Developer / Product Designer",
    company: "Nulogy",
    start: "October 2014",
    end: "January 2016",
    details: [
      "Frontend development using React and Flux architecture on QCloud, a quality control application for manufacturers and packagers",
      "Optimized the application was for touch devices and lower-end iPads",
      "Worked closely with backend developers to determine appropriate data structures and API contracts",
      "Overhauled the UI/UX to make the application easier use",
      "Wrote scalable CSS using SMACSS principles"
    ]
  },
  {
    role: "UX Designer",
    company: "FreshBooks",
    start: "October 2011",
    end: "October 2014",
    details: [
      "Lead the design on major projects such as Automatic Expense Import and Dashboard Redesign",
      "Created a Style Guideline used by the entire development team",
      "Wrote a User Experience Principles Guideline used by the design team",
      "Developed quick UI prototypes in Backbone and conducted weekly user tests",
      "Worked on a new version of FreshBooks developed in Ember"
    ]
  },
  {
    role: "Frontend Developer & Designer",
    company: "Jet Cooper",
    start: "April 2011",
    end: "October 2011",
    details: [
      "Developed responsive websites and functional prototypes",
      "Designed interfaces for web and mobile applications",
      "Projects include: <em>My City Lives</em>, <em>The Lunch Lady</em>, and <em>Tea Sparrow</em>"
    ]
  },
  {
    role: "Freelance Developer & Designer",
    company: null,
    start: "January 2011",
    end: "March 2011",
    details: [
      "Managed projects from concept to wireframes and mockups to development and deployment",
      "Clients include: <em>Centre for Social Innovation</em>, <em>The MOWAT Centre for Policy Innovation</em>, <em>The Rosenberg Fund for Children</em> and <em>Toronto Brigantine Inc.</em>"
    ]
  },
  {
    role: "Developer & Designer",
    company: "The Movement",
    start: "May 2009",
    end: "December 2010",
    details: [
      "Worked closely with clients to create print material & websites suitable to their audience",
      "Projects include: <em>Neighbourhood Arts Network</em>, <em>Corporate Knights</em> and <em>Alex Osterwalder</em>"
    ]
  }
];

const EDUCATION = [
  {
    role: "Bachelor of Design Program",
    company: "York University & Sheridan College",
    start: "September 2007",
    end: "May 2009",
    details: [
      "Finished two years of a four-year program before starting work full-time",
      "Studied fundamentals of design history, design principles and typography"
    ]
  },
  {
    role: "Bachelor of Applied Science & Engineering",
    company: "University of Toronto",
    start: "September 2000",
    end: "May 2005",
    details: ["Graduated the Engineering Science program (Aerospace option)"]
  }
];

const INTERESTS = [
  {
    role: "Current Side Project: Zoundboards",
    details: [
      "A platform for creating and sharing soundboards",
      "Building it with React and Redux, and hoping to leverage React Native soon"
    ]
  },
  {
    role: "Avid Podcast Listener",
    details: [
      "Favourites: EconTalk, Planet Money, This American Life, Radiolab, 99% Invisible, Software Engineering Daily"
    ]
  }
];

const SECTIONS = [
  {
    title: "Employment History",
    positions: WORK_HISTORY
  },
  {
    title: "Education",
    positions: EDUCATION
  },
  {
    title: "Interests & Activities",
    positions: INTERESTS
  }
];

const SectionTitle = styled(OriginalSectionTitle)`
  flex: 0 0 30%;

  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 15px;
  }
  @media (min-width: 768px) {
    margin-bottom: 15px;
  }
  @media (min-width: 992px) {
    margin-bottom: 20px;
  }
`;

const WorkSection = styled.div`
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  padding-bottom: 20px;

  &:last-child {
    border-bottom: 0 !important;
  }

  @media (min-width: 768px) {
    display: flex;
    border-bottom: 1px dotted #ccc;
  }

  @media (min-width: 992px) {
    display: flex;
    border-bottom: 1px dotted #ccc;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
`;

const Position = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Company = styled.span`
  font-weight: 400;

  &:before {
    color: #666;
    content: " // ";
  }
`;

const Duration = styled.div`
  font-style: italic;
  color: #666;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 10px;
`;

const Resume = () => (
  <div>
    <WorkSection>
      <SectionTitle>Knowledge & Skills</SectionTitle>
      <ul>
        <li>Languages: Javascript, Elixir, Ruby</li>
        <li>HTML, CSS (LESS and SASS)</li>
        <li>Version control with Git</li>
        <li>UX/UI Design</li>
        <li>Wireframing, prototyping and user-testing</li>
        <li>Adobe Illustrator, Photoshop & InDesign</li>
      </ul>
    </WorkSection>

    {SECTIONS.map(({ title, positions }, index) => (
      <WorkSection key={index}>
        <SectionTitle>{title}</SectionTitle>
        <div>
          {positions.map(({ role, company, start, end, details }, index) => (
            <Position key={index}>
              <h4>
                {role}
                {company && <Company>{company}</Company>}
              </h4>
              {start && (
                <Duration>
                  {start} – {end || "present"}
                </Duration>
              )}
              <ul>
                {details.map((detail, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: detail }}
                  />
                ))}
              </ul>
            </Position>
          ))}
        </div>
      </WorkSection>
    ))}
  </div>
);

export default Resume;
