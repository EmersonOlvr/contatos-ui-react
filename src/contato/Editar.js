import { Collapse, Container, CircularProgress, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import React, { useState } from 'react';

const Editar = props => {
    const [nomeOriginal, setNomeOriginal] = useState('')
    const [emailOriginal, setEmailOriginal] = useState('')

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')

    const [atualizou, setAtualizou] = useState(false)

    const [estaEditando, setEstaEditando] = useState(false)
    const [estaObtendoContato, setEstaObtendoContato] = React.useState(false)

    const [displayErro, setDisplayErro] = useState('none')
    const [msgErro, setMsgErro] = useState('')
    const [displaySucesso, setDisplaySucesso] = useState('none')
    const [msgSucesso, setMsgSucesso] = useState('Contato atualizado com sucesso')

    const [open, setOpen] = React.useState(true);

    const [idContato, setIdContato] = React.useState(props.match.params.idContato)

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

    const obterContatoDaApi = () => {
        setEstaObtendoContato(true)

        setTimeout(() => {
            Axios.get(`http://localhost:8080/contatos/${idContato}`)
                .then(function (response) {
                    console.log('Sucesso!', response.data)

                    setNomeOriginal(response.data.nome)
                    setEmailOriginal(response.data.email)

                    setNome(response.data.nome)
                    setEmail(response.data.email)
                })
                .catch(function (error) {
                    console.log('Erro!', error)
                })
                .finally(function () {
                    setEstaObtendoContato(false)
                })
        }, 1000)
    }

    const handleNome = (e) => {
        setNome(e.target.value)
        if (e.target.value !== nomeOriginal) {
            setAtualizou(true)
        } else {
            setAtualizou(false)
        }
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
        if (e.target.value !== emailOriginal) {
            setAtualizou(true)
        } else {
            setAtualizou(false)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        setEstaEditando(true)

        setTimeout(() => {
            Axios.put('http://localhost:8080/contatos', {
                id: idContato,
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

                    setNomeOriginal(response.data.nome)
                    setEmailOriginal(response.data.email)

                    setAtualizou(false)
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
                    setEstaEditando(false)
                })
        }, 1000)

    }

    React.useEffect(() => {
        console.log('montado')
        let isNumber = !isNaN(idContato)

        if (isNumber) {
            console.log('idContato:', idContato)
            obterContatoDaApi()
        } else {
            props.history.push('/contatos/adicionar')
        }
    }, [])

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Container maxWidth='sm' style={{ marginTop: '2rem' }}>
                        <Paper className={classes.paper}>
                            <div>
                                <h2 className={classes.h2}>Editar Contato</h2>
                                estaObtendoContato: {JSON.stringify(estaObtendoContato)}<br />
                                estaEditando: {JSON.stringify(estaEditando)}
                            </div>

                            <Collapse in={open}>
                                <Alert severity="error" className={classes.alerts} style={{ display: displayErro }} onClose={() => { setOpen(false) }}>{msgErro}</Alert>
                                <Alert severity="success" className={classes.alerts} style={{ display: displaySucesso }} onClose={() => { setOpen(false) }}>{msgSucesso}</Alert>
                            </Collapse>

                            <form id='formulario' method='GET' onSubmit={handleSubmit}>
                                <div>
                                    <input type='hidden' name='id' value={idContato}></input>
                                    <TextField name='nome' label="Nome" value={nome} onChange={handleNome} fullWidth style={{ marginTop: '1.5rem' }} disabled={!(!estaEditando && !estaObtendoContato)} />
                                    <TextField name='email' label="E-mail" value={email} onChange={handleEmail} fullWidth style={{ marginTop: '1rem' }} disabled={!(!estaEditando && !estaObtendoContato)} />
                                    <Button variant="outlined" color="primary" style={{ marginTop: '2rem' }} type='submit' id='btnSubmit' disabled={!(!estaEditando && !estaObtendoContato && atualizou)}>Salvar</Button>
                                </div>
                            </form>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}

export default Editar