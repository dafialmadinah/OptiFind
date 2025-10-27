"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/id";

interface MUIDateTimePickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function MUIDateTimePicker({
    label = "Waktu",
    value,
    onChange,
}: MUIDateTimePickerProps) {
    const [selected, setSelected] = React.useState<Dayjs | null>(
        value ? dayjs(value) : null
    );
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <label className="block font-semibold text-[16px] text-black mb-1 font-poppins">
                {label}
            </label>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
                <DateTimePicker
                    value={selected}
                    onChange={(newValue) => {
                        setSelected(newValue);
                        if (newValue) onChange(newValue.toISOString());
                    }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    ampm={false}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: "outlined",
                            onClick: () => setOpen(true),
                            InputProps: {
                                readOnly: true,
                                sx: {
                                    borderRadius: "10px",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    userSelect: "none", // ⬅ tidak bisa ngeblok teks
                                    "& input": {
                                        paddingY: "2px", // ⬅ kecilin padding vertical
                                        paddingX: "12px",
                                        cursor: "pointer",
                                        userSelect: "none", // ⬅ pastikan di input juga
                                    },
                                    "& fieldset": {
                                        borderColor: "#b0b0b0",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#999",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#60a5fa",
                                    },
                                },
                            },
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
}
