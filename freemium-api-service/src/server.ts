import express from 'express';
import { createServer } from 'http';
import { config } from './config';
import app from './app';

const PORT = config.port || 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server shut down gracefully');
        process.exit(0);
    });
});