import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Layout from "../../layout";
import { useMutation, useQuery } from 'react-query';
import { deleteComunidadApi, getComunidadesApi, getUsersApi, registerComunidadApi } from '../../my-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    nombre: yup.string().required('Nombre es requerido'),
});

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Nombre',
    },
    {
        id: 'calories',
        numeric: false,
        disablePadding: false,
        label: 'Acciones',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Usuarios Registrados
            </Typography>

        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);



    // Query
    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isError: isErrorDataUser,
        refetch: refetchDataUser,
    } = useQuery(["getComunidadesApi", {
        page: page + 1,
        limit: rowsPerPage,
    }], () => getComunidadesApi({
        page: page + 1,
        limit: rowsPerPage,
    }));

    const { register, handleSubmit, formState: { errors }, reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    //mutation
    const mutation = useMutation((data) => registerComunidadApi(data), {
        onSuccess: () => {
            alert("Comunidad creada correctamente");
            reset();
        },
        onError: (error) => {
            alert("Error al crear comunidad");
        }
    });

    const onSubmit = (data) => {
        console.log(data);
      
    };


    const mutationDelete = useMutation((data) => deleteComunidadApi(data), {
        onSuccess: () => {
            alert("Usuario eliminado correctamente");
            refetchDataUser();
        },
        onError: (error) => {
            alert("Error al eliminar usuario");
            console.log(error);
        }
    });

    const handleSubmitDelete = (data) => {
        mutationDelete.mutate({
            keyword: data.keyword,
        });
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = (Array.isArray(dataUser?.data) ? dataUser?.data : []).map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (dataUser?.Nusuarios || 0)) : 0;

    if (isLoadingDataUser) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <span class="loader"></span>
                </div>
            </Layout>
        );
    }

    if (isErrorDataUser) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <p>Error...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ width: '100%' }}>
                <div className="px-10 py-2 mb-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="text-2xl text-center">
                            Datos Principales
                        </h2>
                        <hr />
                        <div className="mb-5">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                                Nombre de la Comunidad
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                {...register("nombre")}
                                placeholder="Nombre"
                                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                            {
                                errors.nombre && (
                                    <span className="text-red-500 text-xs">
                                        {errors.nombre.message}
                                    </span>
                                )
                            }
                        </div>
                        <button
                            type="submit"
                            className="block w-full px-4 py-2 mt-2 text-base font-medium text-white transition duration-500 ease-in-out transform bg-[#01D9AD] border-[#01D9AD] rounded-md hover:bg-green-700 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-green-200"
                        >
                            Registrar
                        </button>
                    </form>
                </div>
                <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={dataUser?.Nusuarios}
                            />
                            <TableBody>
                                {(Array.isArray(dataUser?.data) ? dataUser?.data : []).map((row, index) => {
                                    console.log("row", row);
                                    const isItemSelected = isSelected(row);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                align="left"
                                            >
                                                {row}
                                            </TableCell>
                                            <TableCell align="left">
                                                <button
                                                    onClick={() => {
                                                        handleSubmitDelete({
                                                            keyword: row,
                                                        })
                                                    }}
                                                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                                >
                                                    Eliminar
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Layout>
    );
}