import React from "react";

export default React.createClass({
  render() {
    return (
      <div>
        <div className="work-section">
          <div className="row">
            <div className="col-sm-3 col-print-3">
              <h3 className="work-section__title">Knowledge &amp; Skills</h3>
            </div>
            <div className="col-sm-9 col-md-7 col-print-9">
              <ul className="flush-top push-bottom">
                <li>Javascript development (React, Ember, Backbone, jQuery, Lodash, Ramda)</li>
                <li>HTML, CSS (LESS and SASS)</li>
                <li>Testing with Jasmine, Mocha and Chai</li>
                <li>Version control with Git</li>
                <li>UX/UI Design</li>
                <li>Wireframing, prototyping and user-testing</li>
                <li>Adobe Illustrator, Photoshop &amp; InDesign</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="work-section">
          <div className="row">
            <div className="col-sm-3 col-print-3">
              <h3 className="work-section__title">Employment History</h3>
            </div>
            <div className="col-sm-9 col-md-7 col-print-9">
              <div className="position">
                <h4 className="position__title">
                  Front-end Developer / Product Designer
                  <span className="position__company">Nulogy</span>
                </h4>
                <div className="position__duration">October 2014 &ndash; present</div>
                <ul>
                  <li>Front-end development using React and Flux architecture on QCloud, a quality control application for manufacturers and packagers</li>
                  <li>Optimized the application was for touch devices and lower-end iPads</li>
                  <li>Worked closely with backend developers to determine appropriate data structures and API contracts</li>
                  <li>Overhauled the UI/UX to make the application easier use</li>
                  <li>Wrote scalable CSS using SMACSS principles</li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  UX Designer
                  <span className="position__company">FreshBooks</span>
                </h4>
                <div className="position__duration">October 2011 &ndash; October 2014</div>
                <ul>
                  <li>Lead the design on major projects such as Automatic Expense Import and Dashboard Redesign</li>
                  <li>Created a Style Guideline used by the entire development team</li>
                  <li>Wrote a User Experience Principles Guideline used by the design team</li>
                  <li>Developed quick UI prototypes in Backbone and conducted weekly user tests</li>
                  <li>Worked on a new version of FreshBooks developed in Ember</li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Front-End Developer &amp; Designer
                  <span className="position__company">Jet Cooper</span>
                </h4>
                <div className="position__duration">
                  April 2011 &ndash; October 2011
                </div>
                <ul>
                  <li>Developed responsive websites and functional prototypes</li>
                  <li>Designed interfaces for web and mobile applications</li>
                  <li>Projects include: <em>My City Lives</em>, <em>The Lunch Lady</em>, and <em>Tea Sparrow</em></li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Freelance Developer &amp; Designer
                </h4>
                <div className="position__duration">January 2011 &ndash; March 2011</div>
                <ul>
                  <li>Managed projects from concept to wireframes and mockups to development and deployment</li>
                  <li>Clients include: <em>Centre for Social Innovation</em>, <em>The MOWAT Centre for Policy Innovation</em>, <em>The Rosenberg Fund for Children</em> and <em>Toronto Brigantine Inc.</em></li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Developer &amp; Designer
                  <span className="position__company">The Movement</span>
                </h4>
                <div className="position__duration">
                  May 2009 &ndash; December 2010
                </div>
                <ul>
                  <li>Worked closely with clients to create print material &amp; websites suitable to their audience</li>
                  <li>Projects include: <em>Neighbourhood Arts Network</em>, <em>Corporate Knights</em> and <em>Alex Osterwalder</em></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="work-section">
          <div className="row">
            <div className="col-sm-3 col-print-3">
              <h3 className="work-section__title">Education</h3>
            </div>
            <div className="col-sm-9 col-md-7 col-print-9">
              <div className="position">
                <h4 className="position__title">
                  Bachelor of Design Program
                  <span className="position__company">York University &amp; Sheridan College</span>
                </h4>
                <div className="position__duration">September 2007 &ndash; May 2009</div>
                <ul>
                  <li>Finished two years of a four-year program before starting work full-time</li>
                  <li>Studied fundamentals of design history, design principles and typography</li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Bachelor of Applied Science &amp; Engineering
                  <span className="position__company">University of Toronto</span>
                </h4>
                <div className="position__duration">September 2001 &ndash; May 2005</div>
                <ul>
                  <li>Graduated the Engineering Science program (Aerospace option)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="work-section">
          <div className="row">
            <div className="col-sm-3 col-print-3">
              <h3 className="work-section__title">Interests and Activities</h3>
            </div>
            <div className="col-sm-9 col-md-7 col-print-9">
              <div className="position">
                <h4 className="position__title">
                  Current Side Project: Zoundboards
                </h4>
                <ul>
                  <li>A platform for creating and sharing soundboards</li>
                  <li>Building it with React and Redux, and hoping to leverage React Native soon</li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Avid Podcast Listener
                </h4>
                <ul>
                  <li>Favourites: EconTalk, Planet Money, This American Life, 99% Invisible, On The Grid, Javascript Jabber, Software Engineering Daily</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }
});
