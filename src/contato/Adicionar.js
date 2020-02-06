import { Collapse, Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import React, { useState } from 'react';

const Adicionar = props => {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')

    const [estaAdicionando, setEstaAdicionando] = useState(false)

    const [displayErro, setDisplayErro] = useState('none')
    const [msgErro, setMsgErro] = useState('')
    const [displaySucesso, setDisplaySucesso] = useState('none')
    const [msgSucesso, setMsgSucesso] = useState('Contato adicionado com sucesso')

    const [open, setOpen] = React.useState(true);

    const useStyles = makeStyles(theme => ({
        paper: {
            padding: theme.spacing(5),
            textAlign: "center",
            // color: theme.palette.text.secondary,
        },
        alerts: {
            textAlign: "left",
            marginTop: 20
        },
        h2: {
            marginBlockStart: 0
        }
    }))
    const classes = useStyles()

    const handleNome = (e) => {
        setNome(e.target.value)
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        setEstaAdicionando(true)

        setTimeout(() => {
            Axios.post('http://localhost:8080/contatos', {
                nome,
                email
            })
                .then(function (response) {
                    console.log('Sucesso!', response.data)

                    if (displayErro === '') {
                        setDisplayErro('none')
                        setMsgErro('')
                    }

                    setDisplaySucesso('')
                    setOpen(true)

                    setNome('')
                    setEmail('')
                })
                .catch(function (error) {
                    console.log('Erro!', error.response?.data)

                    if (displaySucesso === '') {
                        setDisplaySucesso('none')
                    }

                    if (error.response !== undefined && error.response.data.message !== '') {
                        setMsgErro(error.response.data.message)
                    } else {
                        setMsgErro('Desculpe, algo deu errado')
                    }
                    setDisplayErro('')
                    setOpen(true)
                }).finally(function () {
                    setEstaAdicionando(false)
                })
        }, 1000)

    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Container maxWidth='sm' style={{ marginTop: '2rem' }}>
                        <Paper className={classes.paper}>
                            <div>
                                <h2 className={classes.h2}>Adicionar Contato</h2>
                                Preencha os campos abaixo para cadastrar um novo Contato.
                            </div>

                            <Collapse in={open}>
                                <Alert severity="error" className={classes.alerts} style={{ display: displayErro }} onClose={() => { setOpen(false) }}>{msgErro}</Alert>
                                <Alert severity="success" className={classes.alerts} style={{ display: displaySucesso }} onClose={() => { setOpen(false) }}>{msgSucesso}</Alert>
                            </Collapse>

                            <form id='formulario' method='GET' onSubmit={handleSubmit}>
                                <TextField name='nome' label="Nome" value={nome} onChange={handleNome} fullWidth style={{ marginTop: '1.5rem' }} disabled={estaAdicionando} />
                                <TextField name='email' label="E-mail" value={email} onChange={handleEmail} fullWidth style={{ marginTop: '1rem' }} disabled={estaAdicionando} />
                                <Button variant="outlined" color="primary" style={{ marginTop: '2rem' }} type='submit' id='btnSubmit' disabled={estaAdicionando}>Adicionar</Button>
                            </form>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}

export default Adicionar