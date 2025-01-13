import React, { FC } from "react";
import { Drink } from "../types/Drink";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DrinkTableProps {
    drinks: Drink[];
    removingId: number | null;
    onRemove: (id: number) => void;
    onAnimationEnd: (id: number) => void;
}

const DrinkTable: FC<DrinkTableProps> = ({
    drinks,
    removingId,
    onRemove,
    onAnimationEnd,
}) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Drink</TableCell>
                        <TableCell>Volume (ml)</TableCell>
                        <TableCell>ABV (%)</TableCell>
                        <TableCell>Pure Alcohol (ml)</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drinks.map((drink) => {
                        const pureAlc = (drink.volume * (drink.abv / 100)).toFixed(2);
                        const rowClass = drink.id === removingId ? "fade-out" : "fade-in";
                        return (
                            <TableRow
                                key={drink.id}
                                className={rowClass}
                                onAnimationEnd={() => onAnimationEnd(drink.id)}
                                data-cy="drink-row"
                            >
                                <TableCell data-cy="drink-name">{drink.name}</TableCell>
                                <TableCell data-cy="drink-volume">{drink.volume.toFixed(2)}</TableCell>
                                <TableCell data-cy="drink-abv">{drink.abv}</TableCell>
                                <TableCell data-cy="drink-pure-alcohol">{pureAlc}</TableCell>
                                <TableCell data-cy="drink-actions" align="center">
                                    <IconButton
                                        data-cy="delete-button"
                                        color="error"
                                        onClick={() => onRemove(drink.id)}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DrinkTable;