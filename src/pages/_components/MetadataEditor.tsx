import React, { useState, useEffect, useRef } from "react";

interface MetadataEditorProps {
    value: string; // JSON string (object key-value)
    onChange: (val: string) => void;
}

interface KV {
    key: string;
    value: string;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ value, onChange }) => {
    const [items, setItems] = useState<KV[]>([]);
    const lastJson = useRef<string>(""); // untuk mendeteksi perubahan value prop

    // ✅ hanya sync ulang jika prop value BENAR-BENAR berubah
    useEffect(() => {
        if (value === lastJson.current) return; // skip jika value sama dengan terakhir
        lastJson.current = value;

        try {
            if (value) {
                const obj = JSON.parse(value);
                if (obj && typeof obj === "object" && !Array.isArray(obj)) {
                    const arr: KV[] = Object.entries(obj).map(([k, v]) => ({
                        key: String(k),
                        value: String(v ?? ""),
                    }));
                    setItems(arr);
                    return;
                }
            }
        } catch {
            /* abaikan error parse */
        }
        setItems([]); // default kosong
    }, [value]);

    const updateItems = (newItems: KV[]) => {
        setItems(newItems);
        try {
            const obj: Record<string, string> = {};
            newItems.forEach(({ key, value }) => {
                if (key.trim() !== "") obj[key.trim()] = value;
            });
            const json = JSON.stringify(obj);
            lastJson.current = json; // simpan JSON terbaru
            onChange(json);
        } catch {
            onChange("{}");
        }
    };

    const handleKeyChange = (index: number, newKey: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], key: newKey };
        updateItems(newItems);
    };

    const handleValueChange = (index: number, newVal: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], value: newVal };
        updateItems(newItems);
    };

    const addRow = () => {
        updateItems([...items, { key: "", value: "" }]);
    };

    const removeRow = (index: number) => {
        updateItems(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            {items.map((item, i) => (
                <div className="d-flex mb-2" key={i}>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => handleKeyChange(i, e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => handleValueChange(i, e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-icon"
                        onClick={() => removeRow(i)}
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addRow}
            >
                + Add Row
            </button>
        </div>
    );
};

export default MetadataEditor;
