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
import { getEmpresasApi, getUsersApi } from '../../my-api';
import { dataMotos, dataMotosC } from '@/data/newDataMotos';


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
        id: 'Id',
        numeric: false,
        disablePadding: true,
        label: 'Id',
    },
    {
        id: 'Marca_y_modelo',
        numeric: true,
        disablePadding: false,
        label: 'Marca y Modelo',
    },
    {
        id: 'Km',
        numeric: true,
        disablePadding: false,
        label: 'Km Total',
    },
    {
        id: 'CO2',
        numeric: true,
        disablePadding: false,
        label: 'Kg de CO2',
    },
    {
        id: 'TELEFONOS',
        numeric: true,
        disablePadding: false,
        label: 'Telefonos Cargados',
    },
    {
        id: 'ARBOLES',
        numeric: true,
        disablePadding: false,
        label: 'Arboles Urbanos',
    },
    {
        id: 'BOLSAS',
        numeric: true,
        disablePadding: false,
        label: 'Bolsas de Basura recicladas',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        console.log("search", property);
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
                Datos Registrados
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
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [dataMotosC, setDataMotosC] = React.useState([]);

    React.useEffect(() => {
        setDataMotosC(dataMotos);
    }, [dataMotos]);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        console.log("property", property);
        let arr = dataMotosC;
        if (property === "Id") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.Id - b.Id;
                } else {
                    return b.Id - a.Id;
                }
            });
        } else if (property === "Marca_y_modelo") {
            console.log("property123", property);
            //order alfabeticamente
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.Marca_y_modelo.localeCompare(b.Marca_y_modelo);
                }
                return b.Marca_y_modelo.localeCompare(a.Marca_y_modelo);
            });
            
        } else if (property === "Km") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.Km - b.Km;
                } else {
                    return b.Km - a.Km;
                }
            });
        } else if (property === "CO2") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.CO2 - b.CO2;
                } else {
                    return b.CO2 - a.CO2;
                }
            });
        } else if (property === "TELEFONOS") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.TELEFONOS - b.TELEFONOS;
                } else {
                    return b.TELEFONOS - a.TELEFONOS;
                }
            });
        } else if (property === "ARBOLES") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.ARBOLES - b.ARBOLES;
                } else {
                    return b.ARBOLES - a.ARBOLES;
                }
            });
        } else if (property === "BOLSAS") {
            arr = dataMotosC.sort((a, b) => {
                if (isAsc) {
                    return a.BOLSAS - b.BOLSAS;
                } else {
                    return b.BOLSAS - a.BOLSAS;
                }
            });
        }

        setDataMotosC(arr);

    };

    const handleSearch = (event) => {
        console.log("search", event.target.value);
        const value = event.target.value;
        const arr = dataMotos.filter((item) => {
            return item.Marca_y_modelo.toLowerCase().includes(value.toLowerCase()) ||
                item.Id.toString().includes(value) ||
                item.Km.toString().includes(value) ||
                item.CO2.toString().includes(value) ||
                item.TELEFONOS.toString().includes(value) ||
                item.ARBOLES.toString().includes(value) ||
                item.BOLSAS.toString().includes(value);
        });
        setDataMotosC(arr);
    }

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

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (dataUser?.Nusuarios || 0)) : 0;

    return (
        <Layout>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Buscar"
                            onChange={handleSearch}
                            className="p-2 rounded-md border border-gray-300 w-full mt-2 mb-2"
                        />
                    </Box>
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
                                rowCount={dataMotosC?.length || 0}
                            />
                            <TableBody>
                                {(Array.isArray(dataMotosC) ? dataMotosC : []).map((row, index) => {
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
                                                align="left"
                                            >
                                                {row.Id}
                                            </TableCell>
                                            <TableCell align="left">{row.Marca_y_modelo}</TableCell>
                                            <TableCell align="left">{row.Km}</TableCell>
                                            <TableCell align="left">{row.CO2}</TableCell>
                                            <TableCell align="left">{row.TELEFONOS}</TableCell>
                                            <TableCell align="left">{row.ARBOLES}</TableCell>
                                            <TableCell align="left">{row.BOLSAS}</TableCell>
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
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={dataMotosC.length}
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