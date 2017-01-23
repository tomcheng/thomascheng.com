import React from "react";
import styled from "styled-components";
import OriginalSectionTitle from "../common/SectionTitle";

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
      <SectionTitle>Knowledge &amp; Skills</SectionTitle>
      <ul>
        <li>Javascript development (React, Ember, Backbone, jQuery, Lodash, Ramda)</li>
        <li>HTML, CSS (LESS and SASS)</li>
        <li>Testing with Jasmine, Mocha and Chai</li>
        <li>Version control with Git</li>
        <li>UX/UI Design</li>
        <li>Wireframing, prototyping and user-testing</li>
        <li>Adobe Illustrator, Photoshop &amp; InDesign</li>
      </ul>
    </WorkSection>

    <WorkSection>
      <SectionTitle>Employment History</SectionTitle>
      <div>
        <Position>
          <h4>
            Front-end Developer / Product Designer
            <Company>Nulogy</Company>
          </h4>
          <Duration>October 2014 &ndash; present</Duration>
          <ul>
            <li>
              Front-end development using React and Flux architecture on
              QCloud, a quality control application for manufacturers and
              packagers
            </li>
            <li>
              Optimized the application was for touch devices and lower-end iPads
            </li>
            <li>
              Worked closely with backend developers to determine appropriate
              data structures and API contracts
            </li>
            <li>
              Overhauled the UI/UX to make the application easier use
            </li>
            <li>
              Wrote scalable CSS using SMACSS principles
            </li>
          </ul>
        </Position>

        <Position>
          <h4>
            UX Designer
            <Company>FreshBooks</Company>
          </h4>
          <Duration>October 2011 &ndash; October 2014</Duration>
          <ul>
            <li>
              Lead the design on major projects such as Automatic Expense
              Import and Dashboard Redesign
            </li>
            <li>
              Created a Style Guideline used by the entire development team
            </li>
            <li>
              Wrote a User Experience Principles Guideline used by the design team
            </li>
            <li>
              Developed quick UI prototypes in Backbone and conducted weekly
              user tests
            </li>
            <li>
              Worked on a new version of FreshBooks developed in Ember
            </li>
          </ul>
        </Position>

        <Position>
          <h4>
            Front-End Developer &amp; Designer
            <Company>Jet Cooper</Company>
          </h4>
          <Duration>
            April 2011 &ndash; October 2011
          </Duration>
          <ul>
            <li>
              Developed responsive websites and functional prototypes
            </li>
            <li>
              Designed interfaces for web and mobile applications
            </li>
            <li>
              Projects include: <em>My City Lives</em>, <em>The Lunch
              Lady</em>, and <em>Tea Sparrow</em>
            </li>
          </ul>
        </Position>

        <Position>
          <h4>
            Freelance Developer &amp; Designer
          </h4>
          <Duration>January 2011 &ndash; March 2011</Duration>
          <ul>
            <li>
              Managed projects from concept to wireframes and mockups to
              development and deployment
            </li>
            <li>
              Clients include: <em>Centre for Social Innovation</em>, <em>The
              MOWAT Centre for Policy Innovation</em>, <em>The Rosenberg Fund
              for Children</em> and <em>Toronto Brigantine Inc.</em>
            </li>
          </ul>
        </Position>

        <Position>
          <h4>
            Developer &amp; Designer
            <Company>The Movement</Company>
          </h4>
          <Duration>
            May 2009 &ndash; December 2010
          </Duration>
          <ul>
            <li>
              Worked closely with clients to create print material &amp;
              websites suitable to their audience
            </li>
            <li>
              Projects include: <em>Neighbourhood Arts Network</em>,
              <em>Corporate Knights</em> and <em>Alex Osterwalder</em>
            </li>
          </ul>
        </Position>
      </div>
    </WorkSection>

    <WorkSection>
      <SectionTitle>Education</SectionTitle>
      <div>
        <Position>
          <h4>
            Bachelor of Design Program
            <Company>York University &amp; Sheridan College</Company>
          </h4>
          <Duration>September 2007 &ndash; May 2009</Duration>
          <ul>
            <li>Finished two years of a four-year program before starting work full-time</li>
            <li>Studied fundamentals of design history, design principles and typography</li>
          </ul>
        </Position>

        <Position>
          <h4>
            Bachelor of Applied Science &amp; Engineering
            <Company>University of Toronto</Company>
          </h4>
          <Duration>September 2001 &ndash; May 2005</Duration>
          <ul>
            <li>Graduated the Engineering Science program (Aerospace option)</li>
          </ul>
        </Position>
      </div>
    </WorkSection>

    <WorkSection>
      <SectionTitle>Interests &amp; Activities</SectionTitle>
      <div>
        <Position>
          <h4>
            Current Side Project: Zoundboards
          </h4>
          <ul>
            <li>A platform for creating and sharing soundboards</li>
            <li>Building it with React and Redux, and hoping to leverage React Native soon</li>
          </ul>
        </Position>

        <Position>
          <h4>
            Avid Podcast Listener
          </h4>
          <ul>
            <li>
              Favourites: EconTalk, Planet Money, This American Life, 99%
              Invisible, On The Grid, Javascript Jabber, Software Engineering
              Daily
            </li>
          </ul>
        </Position>
      </div>
    </WorkSection>
  </div>
);

export default Resume;
