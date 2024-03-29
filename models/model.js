import Container from '$core/container';

import { Mesh, MeshBasicMaterial, BoxBufferGeometry } from 'three';
import { World, Body, Box, Vec3, Material, ContactMaterial } from 'cannon-es';
import { deepGet, extend, isObject } from '$core/utils/object';

const HALF_PI = Math.PI / 2;
class Model extends Container {
    
    static defaulMaterial = new Material('physics');
    constructor (options) {
        super(options);
        //Object.assign(this, options);
        console.log(this.$name);
        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        this.body = this.createBody();
        this.model = this.createModel();
        
        //this.body.quaternion.setFromAxisAngle(this.getRotation(), Math.PI/2);
        this.model.position.copy(this.body.position);
        this.$listen({game: ['destroy']});
        return this;
    }
    
    
    set(name, value) {
        this[name] = value;
        this.model[name] = value;
        this.body[name] = value;
        return this;
    }
    
    createModel() {
        return new Mesh(this.geometry, this.material);
    }
    
    createGeometry() {
        return this.geometry;
    }
    
    createThreeMaterial() {
        return this.material;
        if (this.threeMaterial) {
            return this.threeMaterial;
        }
        return new MeshBasicMaterial({
            color: 0xff8800,
            wireframe: true
        });
    }
    
    createBody() {
        const shape = this.createShape();
        if (!this.body) {
            this.body = new Body({
                mass: 0,
                position: this.getPosition(),
                material: this.getBodyMaterial(),
                shape
            });
        }
        
        this.body.addShape(shape);
        
        return this.body;
    }
    
    createBodyMaterial() { 
        if (this.material) {
            return this.material;
        }
        return new Material('physics');
    }
    
    createShape() {
        if (!this.shape) {
            this.shape = new Box();
        }
        
        return this.shape;
    }
    
    getPosition() {
        
        if (!this.position) {
            this.position = new Vec3(0, 0, 0);
        } else if (Array.isArray(this.position)) {
            this.position = new Vec3(this.position[0] || 0, this.position[1] || 0, this.position[2] || 0);
        }        
        
        return this.position;
    }
    
    setNewPosition(x, y = null, z = null) {
        
        if (typeof x === 'string') {
            this.body.position[x] = y;
        } else if (typeof x === 'object') {
            for (let p in ['x', 'y', 'z']) {
                if (typeof x[p] === 'number') {
                    this.body.position[p] = x[p];
                }
            }
        } else if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ) {
            this.body.position.set(x, y, z);
        }
        
        this.updatePosition();
    }
    
    setPosition(x = 0, y = 0, z = 0) {
        this.body.position.set(x, y, z);
        this.model.position.copy(this.body.position);
        return this;
    }
    
    setX(value) {
        this.body.position.x = value;
        this.updatePosition();
        return this;
    }
    
    setY(value) {
        this.body.position.y = value;
        this.updatePosition();
        return this;
    }
    
    setZ(value) {
        this.body.position.y = value;
        this.updatePosition();
        return this;
    }
    
    setColor(color) {
        this.model.material.setColor(color);
    }
    
    setOpacity(opacity) {
        this.model.material.opacity = opacity;
    }
    
    setIncrease(props) {
        const $props = ['x', 'y', 'z'];
        for (let prop in $props) {
            if (props.hasOwnProperty($props[prop])) {
                this.body.position[$props[prop]] = props[prop];
            }
        }
        this.updatePosition();
        return this;
    } 
    
    increaseX(value) {
        this.body.position.x += value;
        this.updatePosition();
        return this;
    }
    
    increaseY(value) {
        this.body.position.y += value;
        this.updatePosition();
        return this;
    }
    
    increaseZ(value) {
        this.body.position.z += value;
        this.updatePosition();
        return this;
    }
    
    getRotation() {
        if (!this.rotation) {
            this.rotation = new Vec3(0, 0, 0);
        }
        
        if (Array.isArray(this.rotation)) {
            this.rotation = new Vec3(this.rotation[0] || 0, this.rotation[1] || 0, this.rotation[2] || 0);
        }        
        
        return this.rotation;
    }
    
    setNewRotation(x, y = null, z = null) {
        
        if (typeof x === 'string') {
            this.body.quaternion[x] = y;
        } else if (typeof x === 'object') {
            for (let p in ['x', 'y', 'z']) {
                if (typeof x[p] === 'number') {
                    this.body.quaternion[p] = x[p];
                }
            }
        } else if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ) {
            this.body.quaternion.set(x, y, z);
        }
        
    }
    
    setRotation(x, y, z) {
        this.model.rotation.set(x, y, z);
        this.body.quaternion.setFromAxisAngle(new Vec3(x, y, z), HALF_PI);
        this.model.quaternion.copy(this.body.quaternion);
        return this;
    }
    
    rotateX(value) {
        this.model.rotation.x = value;
        this.body.quaternion.setFromAxisAngle(new Vec3(value, 0, 0), HALF_PI);
        return this;
    }
    
    rotateY(value) {
        this.model.rotation.y = value;
        this.body.quaternion.setFromAxisAngle(new Vec3(0, value, 0), HALF_PI);
        return this;
    }
    
    rotateZ(value) {
        this.model.rotation.z = value;
        this.body.quaternion.setFromAxisAngle(new Vec3(0, 0, value), HALF_PI);
        return this;
    }
    
    update() {
        this.model.position.copy(this.body.position);
        this.model.quaternion.copy(this.body.quaternion);
        return this;
    }
    
    updatePosition() {
        this.model.position.copy(this.body.position);
        return this;
    }
    
    updateQuaternion() {
        this.model.quaternion.copy(this.body.quaternion);
        return this;
    }
    
    build() {
        
    }
    
    clone() {
        return this.model.clone();
    }
    
    game_destroy() {
        this.$clear();
    }
}

Model.prototype.zeroRotation = new Vec3(0,0,0);

export default Model;