import React from "react";

export default React.createClass({
  render() {
    return (
      <div>
        <div className="work-section">
          <div className="row">
            <div className="col-sm-3">
              <h3 className="work-section__title">Knowledge &amp; Skills</h3>
            </div>
            <div className="col-sm-9 col-md-7">
              <ul className="flush-top push-bottom">
                <li>UX/UI Design</li>
                <li>Wireframing, prototyping and user-testing</li>
                <li>Adobe Illustrator, Photoshop &amp; InDesign</li>
                <li>HTML and CSS (LESS and SASS)</li>
                <li>Javascript development (plain Javscript, jQuery, Backbone, Ember and React)</li>
                <li>Version control with Git</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="work-section">
          <div className="row">
            <div className="col-sm-3">
              <h3 className="work-section__title">Employment History</h3>
            </div>
            <div className="col-sm-9 col-md-7">
              <div className="position">
                <h4 className="position__title">
                  Product Designer
                  <span className="position__company">Nulogy</span>
                </h4>
                <div className="position__duration">October 2014 &ndash; present</div>
                <ul>
                  <li>Lead the visual redesign of <em>PackManager</em>, Nulogy&rsquo;s core product</li>
                  <li>Responsible for over-hauling the UI/UX of <em>QCloud</em>, a Quality Management application</li>
                  <li>Front-end development using React.js</li>
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
                  <li>Created a User Experience Principles Guideline and a Style Guideline for the application</li>
                  <li>Developed UI prototypes and conducted weekly user tests</li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Designer &amp; Front-End Developer
                  <span className="position__company">Jet Cooper</span>
                </h4>
                <div className="position__duration">
                  April 2011 &ndash; October 2011
                </div>
                <ul>
                  <li>Designed interfaces for web and mobile applications</li>
                  <li>Projects include: <em>My City Lives</em>, <em>The Lunch Lady</em>, and <em>Tea Sparrow</em></li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Freelance Designer &amp; Developer
                </h4>
                <div className="position__duration">January 2011 &ndash; March 2011</div>
                <ul>
                  <li>Managed projects from concept to wireframes and mockups to development and deployment</li>
                  <li>Clients include: <em>Centre for Social Innovation</em>, <em>Waterlution</em>, <em>The MOWAT Centre for Policy Innovation</em>, <em>The Rosenberg Fund for Children</em> and <em>Toronto Brigantine Inc.</em></li>
                </ul>
              </div>

              <div className="position">
                <h4 className="position__title">
                  Designer &amp; Developer
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
            <div className="col-sm-3">
              <h3 className="work-section__title">Education</h3>
            </div>
            <div className="col-sm-9 col-md-7">
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
      </div>
    );
  }
});
