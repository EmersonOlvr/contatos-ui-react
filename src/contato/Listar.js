import { Button, CircularProgress, Collapse, Container, Grid, makeStyles, Paper } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Listar = () => {
    const [displayErro, setDisplayErro] = useState('none')
    const [msgErro, setMsgErro] = useState('')
    const [displaySucesso, setDisplaySucesso] = useState('none')
    const [msgSucesso, setMsgSucesso] = useState('')

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
            marginBlockStart: 0,
            marginBlockEnd: '30px'
        },
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 340,
        },
        actionButtons: {
            marginLeft: 10,
        },
    }))
    const classes = useStyles()

    const [dadosApi, setDadosApi] = React.useState([])
    const [estaObtendoDados, setEstaObtendoDados] = React.useState(true)
    const [estaExcluindo, setEstaExcluindo] = React.useState(false)

    const columns = [
        { id: 'id', label: 'ID', minWidth: 70 },
        { id: 'nome', label: 'Nome', minWidth: 150 },
        { id: 'email', label: 'E-mail', minWidth: 200 },
        { id: 'actions', label: 'Ações', minWidth: 200 },
    ];
    const [rows, setRows] = React.useState([])

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const obterDadosDaApi = () => {
        console.log('Obtendo dados da API...')

        setEstaObtendoDados(true)

        setTimeout(() => {
            Axios.get('http://localhost:8080/contatos')
                .then(function (response) {
                    console.log('Sucesso!', response.data)

                    setRows(response.data)
                })
                .catch(function (error) {
                    console.log('Erro!', error.response)
                }).finally(function () {
                    setEstaObtendoDados(false)
                })
        }, 500)
    }

    const excluir = (event, id) => {
        setEstaExcluindo(true)

        setTimeout(() => {
            Axios.delete(`http://localhost:8080/contatos/${id}`)
                .then(function (response) {
                    console.log('Sucesso!', response)

                    if (response.status === 204) {
                        mostrarMsgSucesso('Contato excluído com sucesso!')
                        obterDadosDaApi()
                    }

                })
                .catch(function (error) {
                    console.log('Erro!', error.response)

                    if (error.response !== undefined && error.response.data.status === 404) {
                        mostrarMsgErro(error.response.data.message)
                    } else {
                        mostrarMsgErro('Desculpe, algo deu errado')
                    }
                })
                .finally(function () {
                    setEstaExcluindo(false)
                })
        }, 500)
    }

    const mostrarMsgSucesso = msg => {
        setOpen(true)
        if (displayErro === '') {
            setDisplayErro('none')
        }
        setDisplaySucesso('')
        setMsgSucesso(msg)
    }

    const mostrarMsgErro = msg => {
        setOpen(true)
        if (displaySucesso === '') {
            setDisplaySucesso('none')
        }
        setDisplayErro('')
        setMsgErro(msg)
    }

    React.useEffect(() => {
        console.log('montado')
        obterDadosDaApi()
    }, [])

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
                        <Paper className={classes.paper}>
                            {/* {estaObtendoDados && 'está obtendo'}
                            {!estaObtendoDados && 'não está obtendo'} */}
                            <div>
                                <h2 className={classes.h2}>Listagem de Contatos</h2>
                            </div>

                            <Collapse in={open} style={{ marginBottom: 20 }}>
                                <Alert severity="error" className={classes.alerts} style={{ display: displayErro }} onClose={() => { setOpen(false) }}>{msgErro}</Alert>
                                <Alert severity="success" className={classes.alerts} style={{ display: displaySucesso }} onClose={() => { setOpen(false) }}>{msgSucesso}</Alert>
                            </Collapse>

                            <TableContainer className={classes.container}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map(column => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            estaObtendoDados &&
                                            <TableRow hover role="checkbox">
                                                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>
                                        }
                                        {
                                            (!estaObtendoDados && rows.length > 0) &&
                                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                                const id = row['id']
                                                const nome = row['nome']
                                                const email = row['email']
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                                                        {/*columns.map(column => {
                                                            const value = row[column.id];
                                                            return (
                                                                <>
                                                                    <TableCell key={column.id} align={column.align}>
                                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                                    </TableCell>
                                                                </>
                                                            );
                                                        })*/}
                                                        <TableCell>
                                                            {id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {nome}
                                                        </TableCell>
                                                        <TableCell>
                                                            {email}
                                                        </TableCell>
                                                        <TableCell colSpan={2}>
                                                            <Link to={`/contatos/editar/${id}`}>
                                                                <Button variant='outlined' color='primary' size='small' className={classes.actionButtons}>Editar</Button>
                                                            </Link>
                                                            <Button variant='outlined' color='secondary' size='small' className={classes.actionButtons}
                                                                id={'btn' + id}
                                                                onClick={(event) => excluir(event, id)}
                                                                disabled={estaExcluindo}>Excluir</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        }
                                        {
                                            (!estaObtendoDados && rows.length === 0) &&
                                            <TableRow hover role="checkbox">
                                                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                                                    Nenhum contato encontrado.
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 50, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                            <div style={{ textAlign: 'left' }}>
                                <Button variant='contained' color='primary' onClick={obterDadosDaApi}>Atualizar lista</Button>
                            </div>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}

export default Listar