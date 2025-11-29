import {
    Box,
    Typography,
    Stack,
    Button,
} from '@mui/material';
import { FlightTakeoff as FlightIcon } from '@mui/icons-material';


export default function Brand() {

    return (
        <a href="/" style={{ textDecoration: 'none' }}>
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
            >
                <FlightIcon fontSize="small" />
                <Typography
                    variant="overline"
                    sx={{
                        fontWeight: 600,
                        letterSpacing: 1,
                    }}
                >
                    Travel Story
                </Typography>
            </Stack>
        </a>
    );
}
