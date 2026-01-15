import { useEffect, useState } from "react";
import { Properties } from "@/models/Properties";

export function usePropertieDatas() {
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Model = new Properties();
                const response = await Model.list({});
                setDatas(response.properties); // Simpan data ke state
            } catch (error) {
                console.error("Error fetching properties data:", error);
            }
        };

        fetchData();
    }, []);

    return datas;
}
