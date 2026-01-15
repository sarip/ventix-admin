/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 03/08/24
 */

import Head from 'next/head';
import React from "react";

interface CustomHeadProps {
    title: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({ title }) => {
    return (
        <Head>
            <title>{title} - {process.env.NEXT_PUBLIC_APP_NAME}</title>
        </Head>
    );
};

export default CustomHead;

