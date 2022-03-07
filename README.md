# In the Red Dot: Data Visualization of Singapore's Population
Access live demo site [here](https://inthereddot.netlify.app/)

## Overview

Main purpose of the project is to provide visualization of population data from Department of Statistics (DOS) Singapore. 

### Organization's Goals
The goal of the site is to provide an alternative way of presenting data from current DOS website. At the same time, to also consolidate data of population in general in a single place with lesser click points and navigation by making dashboards.

### Users' Goals
General public users who are interested should be able to easily comprehend regarding Singapore's population structure, while the site should be able to provide filters and comparison of datasets for users who are aiming to analyse and study Singapore's population.

---

## The Five Planes of UI/UX

### Strategy

1. **Organisation**
   - Objective: To make population data visualization more accessible and more mobile friendly than DOS
2. **Users: General Public**
   - Objective: Be able to easily comprehend Singapore population structure
   - Needs:
      - Easily access required data sets
      - No need to download infographics from DOS
   - Demographics:
       - Anyone who is interested in Singapore's population
   - Pain point: Need to navigate through various click points in DOS to reach data visualization
3. **Users: Policy Makers/ Analyst/ Researchers**
   - Objective: Be able to study and compare between different Singapore population datasets
   - Needs:
      - Easily access required data sets
      - Able to compare between different datasets
      - No need to download tabulated data from DOS
   - Demographics:
      - Individuals seeking to understant the population in Singapore for policies making or research
      - Individuals seeking to study the population in Singapore for research purposes
      - Individuals seeking to analyst the population in Singapore for marketing purposes
   - Pain point: Tabulated information are hard to study and analysed


User Stories | Acceptance Criteria(s)
------------ | -------------
As a researcher, I would like to see the population trend of different age groups over the years collected so that I can study factors towards aging population in different periods | Charts displayed must be able to update based on a range of years
As a policy maker, I would like to see the different sets of demographic data collected so that I can make better decisions towards new policy and/or policy changes | Site should provide visualization from data collected geographically
As a business owner, I would like to see the geographical distribution of the country I am interested in so that I would know if the market is suited for my product/service within a region/zone | Charts displayed should include a breakdown of population structure in different categories
As a citizen, I would like to see the residency ratio due to concerns of crowding issues | Charts displayed should be easy for users to derive their own conclusion

### Scope

#### Content
The site should at least contain data visualization of the population structure by age group, gender, ethnicity and residency type to provide a general overview of the markup of Singapore over the years. It should also provide distribution of the population in different regions of Singapore.

#### Functional
- Filter and update data based on a single year
- Filter and update data based on a range of years
- Able to look at data based on a single region 
- Able to look at data across different regions 

#### Non-functional
- Mobile responsiveness: charts can be displayed in full across different view ports
- Accessibility: colors used are safe for colorblind
- Performance

### Structure
<figure>
    <img src="/readme/info_design.png" height="500" alt="Information Architecture and Design">
    <figcaption>Information Architecture and Design of the site</figcaption>
</figure>

1. Loading of the site will bring user to the first interactive dashboard _Overview_ of the site
2. Ideally, there will be a loading splash across the screen while fetching and transforming the data necessary for the dashboards
3. Each Dashboard content section will allow users to filter to the data needed
   - Overview: allow users to filter by a single year
   - Past Years Trend: allow users to filter a range of years
   - Plan Area: allow users to see selected data for a particular region in Singapore
   - Compare Areas: allow users to select the areas and category to compare
4. There is a Find Out More page to summarized the site and the data used

### Skeleton
<figure>
    <img src="/readme/initial_prototype.jpg" height="500" alt="Prototype">
    <figcaption>Intial UI/UX design idea</figcaption>
</figure>

### Surface

In order to complement various design intended for the site, Cirrus UI has been chosen to be used in place of Bootstrap.

#### Color Scheme

<figure>
    <img src="/readme/site_color_scheme.png" height="500" alt="Color Scheme">
    <figcaption>Website color scheme to complement primary color</figcaption>
</figure>

- The primary color used is the red used in Singapore's flag[^1]:
- This color is then locked in to Coolors to randomly generate other colors to complement
- Brighter colors are chosen to be used emphasized content
- Lighter colors are used as accents such as shadows and backgrounds

#### Font
Monsterrat is the web font used mostly in the site for headers and Nunito Sans is used for the rest.

#### Icons
Font awesome icons are also used to denote certain elements and to convey intention of the element. Elements included but not limited are tabs, menus and filters.

---

## Testing
Test Cases can be found (here)[/readme/test_cases.xlsx]

---

## Possible Enhancements

- Slider: while working on the project, there was intention to change from prototype to put graphs and charts into carousels for mobile views due to concerns abour scrolling. This is still work in progress, as issues were found during implementation stage.

---

## Challenges and Constraints

1. As there was issue with calling DOS API using Axios due to CORS policy, the current dataset used is downloaded by accessing the endpoint directly. For this reason the site may continue to serve out of date Annaul Population data in future should the data be updated.
2. Geographic distribution dataset from DOS also have unique API, meaning to say that for each time a new survey is done, a new API or JSON file will be required to keep the site updated 
3. As Geographic Distribution regions are based off of 2019 Master Plan, any changes done URA will not be updated

---

## Libraries and Sources

### Technologies Used

1. [Cirrus UI](https://www.cirrus-ui.com/) as base tempalate and CSS library for the UI
   - Lighter than Bootstrap
   - Works similar to Bootstrap, so not much re-learning needs to be done
   - Have the components and utilities that are needed for the project
   - 2 font families offered are what I had in mind
2. [Font Awesome](https://fontawesome.com/) for icons used
3. [Google Font](https://fonts.google.com/) for the fonts used (i.e. Montserrat, Nunito Sans)
4. [AXIOS](https://axios-http.com/docs/intro) for AJAX requests
5. [ApexCharts](https://apexcharts.com/) for all the graphs and charts displayed
6. [Leaflet](https://leafletjs.com/) for Choropleth map
7. [Multi-select](https://github.com/varundewan/multiselect) for forms
8. [Git](https://git-scm.com/) for version control
9. [GitHub](http://github.com) for the repository
10. [Visual Studio Code](https://code.visualstudio.com/)
11. [Netlify](https://www.netlify.com/)
   
### Data Sources

1. Department of Statistics Singapore's Table Builder API
   - https://www.singstat.gov.sg/
   - https://tablebuilder.singstat.gov.sg/
2. Data.gov.sg
   - https://data.gov.sg/dataset/master-plan-2019-planning-area-boundary-no-sea

### Other Attributions
1. [Paul Chor](https://github.com/kunxin-chor) for all his guidance and using his tutorials as references for the codes 
2. [Singapore Map Vectors by seabranddesign, downloaded from Vecteezy](https://www.vecteezy.com/vector-art/145837-free-singapore-map-vectors) for the main logo image used for the site
3. [Annie Spratt](https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) for background image used in Find Out More
4. [Choropleth Map Tutorial](https://leafletjs.com/examples/choropleth/) for the styling of Population Density over Singapore region
5. [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9) for Cartography colors of Population Density
6. [ColorMind](http://colormind.io/) for generating colors used in charts
7. [Coolors](https://coolors.co/462255-313b72-62a87c-7ee081-c3f3c0) for matching the red used in Singapore's flag

---

## Build and Deployment

### Build
The project uses (npm @node-minify)[https://www.npmjs.com/package/node-minify] to minify JS and CSS files included in the HTML and (npm compress-images)[https://www.npmjs.com/package/compress-images] to compress images for web use.

Prerequisites:
- (node and npm)[https://nodejs.org/en/download/] is installed
- @node-minfy/core, @node-minify/uglify-es, and @node-minify/clean-css packages are installed
- compress-images and dependencies are installed

Any changes to images, JS and CSS under the _src_ folder will require the following step to re-build:

At project root folder, run 
```
node compress.js
```

### Deployment
[![Netlify Status](https://api.netlify.com/api/v1/badges/a4606763-89a7-4619-84aa-9e41d6d444e7/deploy-status)](https://app.netlify.com/sites/inthereddot/deploys)(https://app.netlify.com/sites/inthereddot/deploys)

The web app is hosted using [Netlify](https://www.netlify.com/).

Prerequisites:
- Any edits were added, commited, and pushed to Github repository
- Netlify is connected and authorized to Github account
- Netlify is connected to GitHub repository via "New site from Git"
- "GitHub"  has been selected for continuous deployment

Steps to publish[^2]:
1. Go to Netlify and select the team that site has been set up with
2. Browse to the site that needs to be published
3. Go to Deploys and select the deployment to be published

---

[^1]: Singapore Flag colors information is based [here](https://flagcolor.com/singapore-flag-colors/)
[^2]: Steps are only required when auto-publishing is disabled
