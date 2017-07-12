import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { Container, Icon, Button, Loader, Menu, Message } from 'semantic-ui-react'
import { getTimeAgo, getParameterByName } from './utils'
import Cosmic from 'cosmicjs'
import _ from 'lodash'
const config = {
  bucket: {
    slug: getParameterByName('bucket_slug'),
    read_key: getParameterByName('read_key'),
    write_key: getParameterByName('write_key')
  }
}
class App extends Component {
  constructor(props) {
    super();
    this.getStories(this);
    this.getSavedStories(this);
    this.state = {
      saved_stories: [],
      stories: [],
      loading: true
    }
  }
  getStories() {
    axios.get('https://hn.algolia.com/api/v1/search?tags=front_page')
    .then(response => {
      delete this.state.loading
      this.setState({
        top_stories: response.data.hits,
        active_menu_item: 'top_stories',
        stories: response.data.hits
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  getSavedStories() {
    const params = {
      type_slug: 'stories'
    }
    Cosmic.getObjectType(config, params, (err, res) => {
      if (err) {
        this.setState({
          bucket_error: true
        })
      }
      if (!res.objects)
        return
      const saved_stories = res.objects.all
      this.setState({
        ...this.state,
        saved_stories: saved_stories
      })
    })
  }
  handleSaveClick(story) {
    this.setState({
      ...this.state,
      saving: story
    })
    const params = {
      title: story.title,
      type_slug: 'stories'
    }
    params.metafields = []
    // Add Metafields
    Object.keys(story).forEach(function(key) {
      if (key !== '_highlightResult') {
        const metafield = {
          key,
          value: story[key],
          type: 'text'
        }
        params.metafields.push(metafield)
      }
    })
    Cosmic.addObject(config, params, (err, res) => {
      let saved_stories = this.state.saved_stories
      if (!saved_stories)
        saved_stories = []
      saved_stories.push(res.object)
      this.setState({
        ...this.state,
        saved_stories
      })
    })
  }
  handleDeleteClick(story) {
    this.setState({
      ...this.state,
      saving: story
    })
    let saved_story
    this.state.saved_stories.forEach(story_loop => {
      if (story_loop.metadata.objectID === story.objectID)
        saved_story = story_loop
    })
    const params = {
      slug: saved_story.slug
    }
    Cosmic.deleteObject(config, params, (err, res) => {
      let saved_stories = this.state.saved_stories
      saved_stories = saved_stories.filter(loop_story => {
        return loop_story.metadata.objectID !== story.objectID
      })
      delete this.state.saving
      this.setState({
        ...this.state,
        saved_stories
      })
    })
  }
  handleMenuItemClick(key) {
    let saved_stories = this.state.saved_stories
    const top_stories = this.state.top_stories
    if (key === 'saved_stories') {
      // Rekey from saved Objects
      if (saved_stories) {
        saved_stories.map(saved_story => {
          return Object.keys(saved_story.metadata).forEach(function(key) {
            saved_story[key] = saved_story.metadata[key]
          })
        })
      }
      if (!saved_stories)
        saved_stories = null
      this.setState({
        ...this.state,
        active_menu_item: 'saved_stories',
        stories: saved_stories
      })
    }
    if (key === 'top_stories') {
      this.setState({
        ...this.state,
        active_menu_item: 'top_stories',
        stories: top_stories
      })
    }
  }
  handleSavedOver(story) {
    this.setState({
      ...this.state,
      hovered_story: story
    })
  }
  handleSavedOut(story) {
    delete this.state.hovered_story
    this.setState({
      ...this.state
    })
  }
  render() {
    const saved_story_ids = _.map(this.state.saved_stories, 'metadata.objectID')
    const activeItem = this.state.active_menu_item
    return (
      <div className='App'>
        <Container className='App-header'>
          <Icon name='hacker news' style={{ color: '#ff6600', marginTop: 20 }} size='massive' />
          <h1 style={{ marginBottom: 30, marginTop: 10 }}>Hacker News Story Saver</h1>
        </Container>
        <Container>
          <Menu pointing style={{ marginBottom: 20 }}>
            <Menu.Item active={activeItem === 'top_stories'} onClick={this.handleMenuItemClick.bind(this, 'top_stories')} style={{ cursor: 'pointer' }}><Icon name='arrow up' />&nbsp;&nbsp;Top Stories</Menu.Item>
            <Menu.Item active={activeItem === 'saved_stories'} onClick={this.handleMenuItemClick.bind(this, 'saved_stories')} style={{ cursor: 'pointer' }}><Icon name='star' />&nbsp;&nbsp;Saved Stories</Menu.Item>
            <Menu.Item name='Endpoint'><img alt="logo" style={{ width: 20 }} src="https://cosmicjs.com/images/logo.svg" />&nbsp;&nbsp;&nbsp;&nbsp;<a href={ 'https://api.cosmicjs.com/v1/' + config.bucket.slug + '/object-type/stories?pretty=true&hide_metafields=true'} target="_blank">Saved Stories Endpoint</a>&nbsp;&nbsp;&nbsp;<Icon name='external' color='blue' /></Menu.Item>
          </Menu>
          {
            this.state.bucket_error &&
            <Message negative>
              There was an error accessing your Cosmic JS Bucket.  Make sure the query parameter <code>bucket_slug</code> in the URL is correct.
            </Message>
          }
          {
            this.state.loading &&
            <Container style={{ height: 500, marginTop: 40, textAlign: 'center' }}>
              <img alt="logo" style={{ width: 60 }} className="rotating" src="https://cosmicjs.com/images/logo.svg" />
            </Container>
          }
          {
            this.state.stories &&
            this.state.stories.map(story => {
              return (
                <div className='hn-item' key={ story.objectID }>
                  <div className='hn-item__title'>
                    <div className='hn-item__save-button'>
                      {
                        saved_story_ids.indexOf(story.objectID) === -1 &&
                        <Button style={{ height: 40, width: 70 }} primary onClick={ this.handleSaveClick.bind(this, story) }>
                          { this.state.saving && this.state.saving.objectID === story.objectID ? <Loader inverted active inline size='small' style={{ marginTop: '-3px' }} /> : 'Save' }
                        </Button>
                      }
                      {
                        saved_story_ids.indexOf(story.objectID) !== -1 &&
                        <Button onClick={ this.handleDeleteClick.bind(this, story) } style={{ height: 40, width: 70, textAlign: 'center' }} color={`${this.state.hovered_story && this.state.hovered_story.objectID === story.objectID ? 'red' : 'green'}`} onMouseOver={ this.handleSavedOver.bind(this, story) } onMouseOut={ this.handleSavedOut.bind(this) }>
                          <Icon style={{ marginRight: -8, marginTop: -3, color: '#fff' }} name={`${this.state.hovered_story && this.state.hovered_story.objectID === story.objectID ? 'delete' : 'checkmark'}`} size='large' />
                        </Button>
                      }
                      &nbsp;&nbsp;
                    </div>
                    <div className='hn-item__info'>
                      <div>
                        <a href={ story.url } target='_blank'>{ story.title } <Icon name='external' /></a>
                      </div>
                      <div className="hn-item__meta">
                        <a href={`https://news.ycombinator.com/item?id=${story.objectID}`} target="_blank">
                          { story.points } points</a> by <a href={ `https://news.ycombinator.com/user?id=${story.author}` } target='_blank'>{ story.author }</a> <a href={`https://news.ycombinator.com/item?id=${story.objectID}`} target="_blank">{ getTimeAgo(story.created_at_i) } ago</a> <a href={`https://news.ycombinator.com/item?id=${story.objectID}`} target="_blank">{ story.num_comments } comments
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          {
            !this.state.stories &&
              <div>You don't have any saved stories yet.</div>
          }
          {
            this.state.stories && !this.state.stories.length && !this.state.loading &&
              <div>You don't have any saved stories yet.</div>
          }
        </Container>
      </div>
    );
  }
}

export default App;