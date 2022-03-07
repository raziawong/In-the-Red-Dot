# In the Red Dot: Data Visualization of Singapore's Population
Access live demo site [here]()

## Overview

Main purpose of the project is to provide visualization of population data from Department of Statistics (DOS) Singapore. 

### Organization's Goals
The goal of the site is to provide an alternative way of presenting data from current DOS website. At the same time, to also consolidate data of population in general in a single place with lesser click points and navigation by making dashboards.

### Users' Goals
General public users who are interested should be able to easily comprehend regarding Singapore's population structure, while the site should be able to provide filters and comparison of datasets for users who are aiming to analyse and study Singapore's population.

---

## The Five Planes of UI/UX

### Strategy

_Organisation_
- Objective: To make population data visualization more accessible than DOS

_User: General Public_
- Objective: Be able to easily comprehend Singapore population structure
- Needs:
   - Easily access required data sets
   - No need to download infographics from DOS
- Demographics:
    - Anyone who is interested in Singapore's population
- Pain point: Need to navigate through various click points in DOS to reach data visualization

_User: Analyst/ Researchers_
- Objective: Be able to study and compare between different Singapore population datasets
- Needs:
   - Easily access required data sets
   - Able to compare between different datasets
   - No need to download tabulated data from DOS
- Demographics:
    * Individuals seeking to study the population in Singapore for research purposes
    * Individuals seeking to analyst the population in Singapore for marketing purposes
- Pain point: Tabulated information are hard to study and analysed

1. Academics
   - As a researcher, I would like to see the population trend of different age groups over the years collected so that I can study factors towards aging population in different periods
  
2. Policy Makers
   - As a policy maker, I would like to see the different sets of demographic data collected so that I can make better decisions towards new policy and/or policy changes

3. Business Owners / Foreign Investors
   - As a business owner, I would like to see the geographical distribution of the country I am interested in so that I would know if the market is suited for my product/service within a region/zone
  
4. General Public
   - As a citizen, I would like to see the proportion to see residency ratio due to concerns of rising population and crowding issues

### Scope

The site should at least contain data visualization of the population structure by age group, gender, ethnicity and residency type to provide a general overview of the markup of Singapore over the years. It should also provide distribution of the population in different regions of Singapore.

### Interaction Design Prototype
[comment]: # to include images by of initial prototype

### Information Architecture
[comment]: # to include screen shot of sitemap

---

## Libraries and Sources

### Technologies Used

1. [Cirrus UI](https://www.cirrus-ui.com/) as base tempalate and CSS library for the UI
   - Lighter than Bootstrap
   - Works similar to Bootstrap, so not much re-learning needs to be done
   - Have the components and utilities that are needed for the project
   - 2 Typefaces offered that can be paired
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
2. [Singapore Map Vectors by seabranddesign, downloaded from Vecteezy](https://www.vecteezy.com/vector-art/145837-free-singapore-map-vectors)
3. [Choropleth Map Tutorial](https://leafletjs.com/examples/choropleth/)
4. [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9) for Cartography
5. [ColorMind](http://colormind.io/) for generating colors used in charts
6. [Coolors](https://coolors.co/462255-313b72-62a87c-7ee081-c3f3c0) for matching the red used in Singpaore's flag

---

## Build and Deployment

### Build
The project uses (npm @node-minify)[https://www.npmjs.com/package/node-minify] to minify JS and CSS files included in the HTML.

Prerequisites:
- (node and npm)[https://nodejs.org/en/download/] is installed
- @node-minfy/core, @node-minify/uglify-es, and @node-minify/clean-css packages are installed

Any changes to JS and CSS will require the following step to build:

At project root folder, run 
```
node compress.js
```

### Deployment
[![Netlify Status](https://api.netlify.com/api/v1/badges/a4606763-89a7-4619-84aa-9e41d6d444e7/deploy-status)](https://app.netlify.com/sites/inthereddot/deploys)

The web app is hosted using Netlify.

Prerequisites:
- Any edits were added, commited, and pushed to GitHub
- [Netlify](https://www.netlify.com/) is connected and authorized to Github account
- Netlify is connected to GitHub repository via "New site from Git"
- "GitHub"  has been selected for continuous deployment

Steps to publish[^1]:
1. Go to Netlify and select the team that site has been set up with
2. Browse to the site that needs to be published
3. Go to Deploys and select the deployment to be published

[^1]: Steps are only required when auto-publishing is disabled

---

