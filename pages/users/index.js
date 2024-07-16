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
import { useQuery } from 'react-query';
import { getToken, getUsersApi, urlBase } from '../../my-api';
import { Button } from '@mui/material';
import axios from 'axios';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const headCells = [
    {
        id: 'nombre',
        numeric: false,
        disablePadding: true,
        label: 'Nombre',
    },
    {
        id: 'usuario',
        numeric: true,
        disablePadding: false,
        label: 'Usuario',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'categoria',
        numeric: true,
        disablePadding: false,
        label: 'Categoria',
    },
    {
        id: 'referidos',
        numeric: true,
        disablePadding: false,
        label: 'Cantidad de referidos',
    },
    {
        id: 'recorridos',
        numeric: true,
        disablePadding: false,
        label: 'Recorridos',
    },
    {
        id: 'km_total',
        numeric: true,
        disablePadding: false,
        label: 'Total Kilometros (KMS)',
    },
    {
        id: 'cal_total',
        numeric: true,
        disablePadding: false,
        label: 'Total Calorias (KCAL)',
    },
    {
        id: 'co2_total',
        numeric: true,
        disablePadding: false,
        label: 'Total CO2 (Kg)',
    },
    {
        id: 'tiempo_total',
        numeric: true,
        disablePadding: false,
        label: 'Total Tiempo (Min)',
    },
    {
        id: 'empresa',
        numeric: true,
        disablePadding: false,
        label: 'Empresa',
    },
    {
        id: 'genero',
        numeric: true,
        disablePadding: false,
        label: 'Genero',
    },
    {
        id: 'telefono',
        numeric: true,
        disablePadding: false,
        label: 'Telefono',
    },
    {
        id: 'comunidad',
        numeric: true,
        disablePadding: false,
        label: 'Facultad/Area',
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
    const [orderBy, setOrderBy] = React.useState('usuario');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const [filters, setFilters] = React.useState({
        date_start: null,
        date_end: null,
        vehicle: null,
        nombre: null,
    });

    // Query
    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isError: isErrorDataUser,
        refetch: refetchDataUser,
    } = useQuery(["dataUser", {
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        order: order + "," + orderBy,
    }], () => getUsersApi({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        order: order + "," + orderBy,
    }), {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        cacheTime: Infinity,
    });


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        console.log(order, property)
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = (Array.isArray(dataUser?.usuarios) ? dataUser?.usuarios : []).map((n) => n.name);
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

    const handleFilters = (e, type) => {
        setFilters({
            ...filters,
            [type]: e.target.value,
        });
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const exportExcel = () => {
        let dataUser = JSON.parse(localStorage.getItem("data_user"));
        let idEmpresa = dataUser.user.empresaId._id;
        let urlPart2 = "?userId=" +(dataUser.user.tipo == "super" ? 0 : idEmpresa);
        if (filters.vehicle) {
            urlPart2 += "&vehicle=" + filters.vehicle;
        }
        if (filters.date_start) {
            urlPart2 += "&date_start=" + filters.date_start;
        }
        if (filters.date_end) {
            urlPart2 += "&date_end=" + filters.date_end;
        }
        axios.post(`${urlBase}/users/GetBienestarExcel` + urlPart2, {
        },
            //blob
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }).then((response) => {
                console.log(response);
                //decode
                const decoded = atob(response.data);
                console.log(decoded);

                //convert to base64
                const buf = new ArrayBuffer(decoded.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < decoded.length; i++) {
                    view[i] = decoded.charCodeAt(i);
                }
                //create file
                const file = new Blob([view], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(file);
                link.download = 'Usuarios.xlsx';
                link.click();
                //clean
                setTimeout(() => {
                    window.URL.revokeObjectURL(link);
                }, 100);
            });
    }


    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (dataUser?.Nusuarios || 0)) : 0;

    return (
        <Layout>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <div className="flex gap-4 items-center w-full h-auto">
                        <div>
                            <div className="my-4 ml-3 w-full h-auto flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Filtros: </h2>
                            </div>
                            <div className="ml-3 w-full h-auto flex flex-col gap-2 justify-left items-center">
                                <div className="w-full h-auto flex justify-left items-center">
                                    <input type="text"
                                        style={{ borderColor: "#f2f2f2", borderWidth: "1px", borderRadius: "5px", padding: "5px", width: "100%" }}
                                        placeholder="Buscar" onChange={(e) => {
                                            setFilters({
                                                date_start: null,
                                                date_end: null,
                                                vehicle: null,
                                                nombre: null,
                                            });
                                            handleFilters(e, "nombre");
                                        }} value={filters.nombre} />
                                </div>
                                <div className="w-full h-auto flex justify-left items-center">
                                    <input type="date" className="datePickerOne" onChange={(e) => handleFilters(e, "date_start")} value={filters.date_start} />
                                    <input type="date" className="datePickerTwo" onChange={(e) => handleFilters(e, "date_end")} value={filters.date_end} />
                                </div>
                                <div className="w-full h-auto flex justify-left items-center">
                                    <select className="selectPicker" onChange={(e) => handleFilters(e, "vehicle")} value={filters.vehicle}>
                                        <option value="0" disabled selected>
                                            Escoge un medio de transporte
                                        </option>
                                        <option value="Transporte público">Transporte público</option>
                                        <option value="Caminar">Caminar</option>
                                        <option value="Bicicleta">Bicicleta</option>
                                        <option value="Patinete eléctrico">Patinete eléctrico</option>
                                        <option value="Bicicleta eléctrica">Bicicleta eléctrica</option>
                                        <option value="Moto eléctrica">Moto eléctrica</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="my-4 ml-3 w-full h-auto flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Exportar: </h2>
                            </div>
                            <div className="ml-3 w-full h-auto flex flex-col gap-2 justify-left items-center">
                                <div className="w-full h-auto flex justify-left items-center">
                                    <button className="
                            bg-blue-500
                            hover:bg-blue-700
                            text-white
                            font-bold
                            py-2
                            px-4
                            rounded
                            focus:outline-none
                            focus:shadow-outline
                        "
                                        onClick={() => exportExcel()}>Exportar</button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                {(Array.isArray(dataUser?.usuarios) ? dataUser?.usuarios : []).map((row, index) => {
                                    const isItemSelected = isSelected(row.nombre);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.nombre)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.nombre}
                                            selected={isItemSelected}
                                        >
                                            <TableCell
                                                align="right"
                                            >
                                                {row.nombre}
                                            </TableCell>
                                            <TableCell align="right">{row.usuario}</TableCell>
                                            <TableCell align="right">{row.email}</TableCell>
                                            <TableCell align="right">{row.avgViajes >= 10 ? "Elite" : row.avgViajes >= 5 ? "Intermedio" : "Principiante"}</TableCell>
                                            <TableCell align="right">{row.referidos}</TableCell>
                                            <TableCell align="right">{row.recorridos}</TableCell>
                                            <TableCell align="right">{row.km_total.toFixed(2)}</TableCell>
                                            <TableCell align="right">{row.cal_total.toFixed(2)}</TableCell>
                                            <TableCell align="right">{row.co2_total.toFixed(2)}</TableCell>
                                            <TableCell align="right">{row.tiempo_total.toFixed(2)}</TableCell>
                                            <TableCell align="right">{row.empresa}</TableCell>
                                            <TableCell align="right">{row.genero}</TableCell>
                                            <TableCell align="right">{row.telefono}</TableCell>
                                            <TableCell align="right">{row.comunidad}</TableCell>
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
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50, 100000]}
                        component="div"
                        count={dataUser?.Nusuarios || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </Layout>
    );
}