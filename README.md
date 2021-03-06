# Hacker News Top Stories
![Hacker News Story Saver](https://cosmicjs.com/uploads/92d1fe20-6736-11e7-93bc-378cbd5c667a-hn-cosmic.jpg)
### What is it?
A [Cosmic JS](https://cosmicjs.com) Extension that allows you to pull in the top news from [Hacker News](https://news.ycombinator.com/) and save your favorite stories to your Cosmic JS Bucket.  Easily access your favorite stories via your own personal endpoint for use in any internet connected application.  Oh and all story links open in a new browser window (which is nice). Forks welcome!

![Hacker News Story Saver Gif](https://cosmicjs.com/uploads/24ab0760-6737-11e7-aedc-4bbbfe350faa-hn-cosmic.gif)

### It uses:
1. [The Algolia Hacker News API](https://hn.algolia.com/api)
2. [Create React App](https://github.com/facebookincubator/create-react-app)
3. [Semantic UI React](http://react.semantic-ui.com/)
4. [Cosmic JS Extensions](https://cosmicjs.com/extensions)
5. [Cosmic JS NPM Module](https://www.npmjs.com/package/cosmicjs) to save stories to your Bucket

### Why?
It demonstrates how to connect your Cosmic JS Extension to third-party APIs to easily add content to your Cosmic JS Bucket.

## Getting Started
### Quick install
1. [Log in to Cosmic JS](https://cosmicjs.com) and choose a new or existing Bucket to save your Hacker News stories.
2. Go to Your Bucket > Extensions.
3. Find the HN Story Saver Extension and click "Install".

![Hacker News Story Install Gif](https://cosmicjs.com/uploads/2c09b270-677f-11e7-9498-65fe238924be-hn-ext.gif)
### Run locally
```
git clone https://github.com/cosmicjs/hacker-news-top-stories
cd hacker-news-top-stories
yarn
npm start
```
Go to http://localhost:3000?bucket_slug=your-cosmic-js-bucket-slug
