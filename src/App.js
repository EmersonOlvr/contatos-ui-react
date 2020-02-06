import React from 'react';
import './App.css';
import PersistentDrawerLeft from './contato/Navegacao';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import Inicio from './contato/Inicio';
import { BrowserRouter, Route } from 'react-router-dom';
import Adicionar from './contato/Adicionar';
import Testes from './contato/Testes';
import Listar from './contato/Listar';
import Editar from './contato/Editar';

function App() {
  const useStyles = makeStyles(theme => ({
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <main className={clsx(classes.content, {})}>
        <BrowserRouter>
          <div className={classes.drawerHeader} />
          {PersistentDrawerLeft()}
          <Route path='/' exact component={Inicio} />
          <Route path='/contatos/adicionar' component={Adicionar} />
          <Route path='/contatos/listar' exact component={Listar} />
          <Route path='/contatos/editar/:idContato' exact component={Editar} />
          <Route path='/testes' exact component={Testes} />
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
