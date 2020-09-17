import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '../components/Login'
import NotebookList from '../components/NotebookList'
import NoteDetail from '../components/NoteDetail'
import TrashDetail from '../components/TrashDetail'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/notebooks'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/notebooks',
    component: NotebookList
  },
  {
    path: '/note',
    component: NoteDetail
  },
  {
    path: '/trash',
    component: TrashDetail
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
