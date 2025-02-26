# ⚽️🏈 Lennin's Sports Dashboard 🏀🏒

##  Overview
A real-time sports dashboard that displays live game data for my favorite teams. The app fetches and updates game information every 2 minutes during live games and every 5 minutes otherwise.

## 🏃🏽‍♂️ Motivation
I haven’t worked with React since my internship (2018-2020) during school, when React Hooks were still new. The purpose of this project is to reacquaint myself with frontend technologies, particularly React, after spending the past 4 years focused on backend development. 

## 🚀 Live Demo
[![Netlify Status](https://api.netlify.com/api/v1/badges/35a807ad-ce0a-4680-b03e-899114494d45/deploy-status)](https://app.netlify.com/sites/lenninlovessports/deploys)

🔗 **[View Live App](https://lenninlovessports.com)**

## 📦 Features
✅ Display live game data for selected teams  
✅ Auto-refreshes every 2 minutes (during live games) and every 5 minutes (otherwise)  
✅ Uses a sports API for real-time updates  
✅ Mobile-responsive design  

## 🛠 Tech Stack
- **Frontend:** React, React Hooks (Hosted on Netlify)
- **Backend:** Django (Hosted on Digital Ocean)
- **State Management:** useState, useEffect, useCallback
- **API:** TheSportsDB
- **Deployment:** Netlify and Digital Ocean

## 👷🏽‍♂️ Installation

1. Clone the repository:
```bash git clone https://github.com/lenninrodriguez-vandal/lenninssports.git```

2. Navigate to the project directory
```cd lenninssports```

3. Install dependencies
```npm install```

4. You will need to subscribe to TheSportsDB to receive an API Key to be able to make the premium calls. After you get one, create a `.env` in the root directory and add:
```REACT_APP_SPORT_DB_API_KEY=your_api_key_here```

5. Alter the list of ids in the variable `favoriteTeamIds` in MainPage.js line 10 to include the ids of your favorite teams. To find the id for your teams, head to [The Sports DB](https://www.thesportsdb.com/) and locate them using the search. The id will be in the url. For example `https://www.thesportsdb.com/team/134949-Seattle-Seahawks`, the id for the Seattle Seahawks would be `134949`.
```const favoriteTeamIds = [137026, 133612, 140082, 135262, 134949, 134149, 136448];```

6. Start the development server
```npm start```

## 🚀 Deployment
### Deploy to Netlify
1. Push your latest changes to GitHub.

2. Connect your repository to Netlify.

3. Configure build settings:
- Build command: `npm run build`
- Publish directory: `build/`

4. Add environment variables in Netlify settings.

5. Deploy! 🎉

## 💡 Developmental Insights
Building this app was a great way to refresh my React skills. I learned a lot about using React Hooks effectively and handling asynchronous data fetching with `useCallback` and `useEffect`.

## 👷🏽‍♂️ Future Enhancements
- Add the ability to filter games by date or location.
- Implement 'users' so that others can save their favorite teams.
- Improve styling and user experience with additional frontend libraries.
- Going to add Kafka at some point to pull in comments from the related sport teams' subreddits using the Reddit API and determine the sentiment of the comments. Want to see if there is a correlation between team performance and the kind of comments reddit users are posting.
- Introduce OpenAI so that it can summarize each team's last couple of games and display a paragraph under each team.

## 🤝 Contributing
Pull requests are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
