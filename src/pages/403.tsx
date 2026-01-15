/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 03/08/24
 */

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Custom403: React.FC = () => {
    return (
        <Container className="container-xxl container-p-y mt-5">
            <Row className="d-flex justify-content-center text-center">
                <Col>
                    <h1 className="mb-2">Forbidden</h1>
                    <p className="mb-4">Anda tidak memiliki akses ke halaman ini</p>
                    <Button href="/" className="btn btn-primary">Kembali ke home</Button>
                    <div className="mt-5">
                        <img
                            src="/assets/img/illustrations/girl-hacking-site-light.png"
                            alt="page-misc-not-authorized-light"
                            width={450}
                            className="img-fluid"
                            data-app-light-img="illustrations/girl-hacking-site-light.png"
                            data-app-dark-img="illustrations/girl-hacking-site-dark.png"
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Custom403;
