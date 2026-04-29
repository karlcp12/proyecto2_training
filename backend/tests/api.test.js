import request from 'supertest';
import app from '../app.js';
import { pool } from '../db.js';

describe('API Endpoints Tests', () => {
    // Cerrar la conexión a la base de datos después de las pruebas
    afterAll(async () => {
        await pool.end();
    });

    test('GET /roles - should return 200 and a list of roles', async () => {
        const response = await request(app).get('/roles');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('POST /auth/login - should log in with valid credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@sena.edu.co',
                password: 'Admin123'
            });
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('usuario');
        expect(response.body.usuario.email).toBe('admin@sena.edu.co');
    });

    test('POST /auth/login - should fail with invalid credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@sena.edu.co',
                password: 'wrongpassword'
            });
        
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('mensaje');
    });

    test('GET /areas - should return 200 and a list of areas', async () => {
        const response = await request(app).get('/areas');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('GET /usuarios - should return 200 and a list of users', async () => {
        const response = await request(app).get('/usuarios');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('GET /aprendices - should return 200 and a list of apprentices', async () => {
        const response = await request(app).get('/aprendices');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test('GET /stats/dashboard - should return dashboard statistics', async () => {
        const response = await request(app).get('/stats/dashboard');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('totals');
    });

    test('POST /usuarios - should create a new user (registration)', async () => {
        const uniqueId = Date.now();
        const response = await request(app)
            .post('/usuarios')
            .send({
                nombre: 'Nuevo',
                apellidos: 'Usuario',
                email: `user${uniqueId}@example.com`,
                telefono: '1234567890',
                documento: `${uniqueId}`,
                rol: 'Instructor',
                password: 'Password123',
                estado: 'Activo'
            });
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id_usuario');
        expect(response.body.mensaje).toBe('Usuario creado con éxito');
    });
});
