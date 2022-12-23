import Container from '$lib/game/core/container';

import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Box3, Vector3 } from 'three';

const HALF_PI = Math.PI / 2;
class Model extends Container {
    
    constructor (options) {
        super(options);
        let filterMethod;
        for (let attribute in options) {
            filterMethod = `filter_${attribute}`;
            if (typeof this[filterMethod] === 'function') {
                this[attribute] = this[filterMethod](options[attribute]);
            }
        }
        this.model = this.createModel();
        
        this.getRotation();
        this.model.position.copy(this.getPosition());
        return this;
    }
    
    
    set(name, value) {
        this[name] = value;
        this.model[name] = value;
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

    getPosition() {
        
        if (!this.position) {
            this.position = new Vector3(0, 0, 0);
        } else if (Array.isArray(this.position)) {
            this.position = new Vector3(this.position[0] || 0, this.position[1] || 0, this.position[2] || 0);
        } else if(typeof this.position === 'object') {
            this.position = new Vector3(this.position.x || 0, this.position.y || 0, this.position.z || 0);
        }      
        
        return this.position;
    }

    getSize(object = null) {
        const box = new Box3().setFromObject(object || this.model);        
        return {
            width: Math.round(box.max.x - box.min.x) / 2,
            height: Math.round(box.max.y - box.min.y) / 2,
            depth: Math.round(box.max.z - box.min.z) / 2
        };
    }
    
    setPosition(x = 0, y = 0, z = 0) {
        this.model.position.set(x, y, z);
        return this;
    }
    
    setX(value) {
        this.model.position.x = value;
        return this;
    }
    
    setY(value) {
        this.model.position.y = value;
        return this;
    }
    
    setZ(value) {
        this.model.position.y = value;
        return this;
    }
    
    setXY(x, y) {
        this.model.position.x = x;
        this.model.position.y = y;
        return this;
    }
    
    setXZ(x, z) {
        this.model.position.x = x;
        this.model.position.z = z;
        return this;
    }
    
    setYZ(y, z) {
        this.model.position.y = y;
        this.model.position.z = z;
        return this;
    }
    
    setColor(color) {
        this.model.material.setColor(color);
    }
    
    setOpacity(opacity) {
        this.model.material.opacity = opacity;
    }
    
    increaseX(value) {
        this.model.position.x += value;
        return this;
    }
    
    increaseY(value) {
        this.model.position.y += value;
        return this;
    }
    
    increaseZ(value) {
        this.model.position.z += value;
        return this;
    }
    
    getRotation() {
        if (!this.rotation) {
            this.rotation = new Vector3(0, 0, 0);
        }
        
        if (Array.isArray(this.rotation)) {
            this.rotation = new Vector3(this.rotation[0] || 0, this.rotation[1] || 0, this.rotation[2] || 0);
        }        
        
        return this.rotation;
    }
    
    setRotation(x, y, z) {
        this.model.rotation.set(x, y, z);
        return this;
    }
    
    rotateX(value) {
        this.model.rotation.x = value;
        return this;
    }
    
    rotateY(value) {
        this.model.rotation.y = value;
        return this;
    }
    
    rotateZ(value) {
        this.model.rotation.z = value;
        return this;
    }
    
    rotateXY(x, y) {
        this.model.rotation.x = x;
        this.model.rotation.y = y;
        this.rotation.set(x, y, 0);
        return this;
    }
    
    rotateXZ(x, z) {
        this.model.rotation.x = x;
        this.model.rotation.z = z;
        this.rotation.set(x, 0, z);
        return this;
    }
    
    rotateYZ(y, z) {
        this.model.rotation.y = y;
        this.model.rotation.z = z;
        this.rotation.set(0, y, z);
        return this;
    }
    
    rotationX(value) {
        this.model.rotation.x += value;
        return this;
    }
    
    rotationY(value) {
        this.model.rotation.y += value;
        return this;
    }
    
    rotationZ(value) {
        this.model.rotation.z += value;
        return this;
    }
    
    updateRotation(props) {
        for(let i in VERTICES_PROPS) {
            if (props[VERTICES_PROPS[i]]) {
                this.model.rotation[VERTICES_PROPS[i]] = props[VERTICES_PROPS[i]];
            }
        }
    }
    
    
    
    build() {
        
    }
    
    clone() {
        return this.model.clone();
    }
    
    setGuiRotation() {
        for(let i in VERTICES_PROPS) {
            this.gui.add(this.model.rotation, VERTICES_PROPS[i], -2, 2, 0.001);
        }
    }
}

const VERTICES_PROPS = ['x', 'y', 'z'];
Model.prototype.zeroRotation = new Vector3(0,0,0);

export default Model;