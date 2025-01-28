import { Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../models/pagination.model';
import { Memos } from '../models/memos';
import { Departamentos } from '../models/departamentos';
import { Cargos } from '../models/cargos';
import { Firma } from '../models/firmas';
import { reduce } from 'rxjs';

const endpoint = 'http://localhost:3000';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    private token: any = '';

    constructor(private ui: UiService, private http: HttpClient) { 
        const token = localStorage.getItem('token');
        this.token = token ? JSON.parse(token): '';
    }

 //services for login   

    async login(body: any) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = json ? await json?.json() : null;
            
            if (res?.id) {
                this.token = res;
                localStorage.setItem('token', JSON.stringify(res));
                this.ui.messageSuccess('Bienvenido');
            }
        } catch (ex) {
            console.error(ex);
            this.ui.messageError('El usuario no existe o la contraseña es incorrecta');
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res; 
    }

    logout() {
        localStorage.removeItem('token');
        this.token = '';
    }

    async createUser(body: Users) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }


    async getAllUsers(pagination: Pagination) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users?pageNumber=${pagination.page - 1}&pageSize=${pagination.pageSize}`, {
                method: 'get',
                headers: {
                    'Authorization': this.token?.id
                }
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = [];
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }

    async getUser(id: any) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users/view?id=${id}`, {
                method: 'get',
                headers: {
                    'Authorization': this.token?.id
                }
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = [];
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }

    async editUser(body: Users) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users/edit`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = json;
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }    

    async logicDeleteusers(body: Users) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/users/logic-delete`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = json;
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }  


    get user(): any {
        return this.token;
    }

    get isAuthenticated(): boolean {
        return this.token ? true : false;;
    }


    // services for memos
    async getMemo(id: any) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/memos/view?id=${id}`, {
                method: 'get',
                headers: {
                    'Authorization': this.token?.id
                }
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = [];
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }
    async editMemo(body: Memos) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/memos/edit`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = json;
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }    




    async getAllMemos(pagination: Pagination) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/memos?pageNumber=${pagination.page - 1}&pageSize=${pagination.pageSize}`, {
                method: 'get',
                headers: {
                    'Authorization': this.token?.id
                }
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = [];
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }

    async createMemo(body: Memos) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/memos`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = await json.json();
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    }
    async memoDelete(body: Memos) {
        let res: any;
        try {
            const json = await fetch(`${endpoint}/memos/logic-delete`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token?.id
                },
                body: JSON.stringify(body)
            });
            res = json;
        } catch (ex) {
            console.error(ex);
            res = null;
        } finally {
            if (res.object?.message?.error) {
                this.ui.messageError(res.object.message.error);
            }
        }
        return res;
    } 

//services for departamentos
async getDepartamento(id: any) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/departamento/view?id=${id}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async getAllDepartamentos(pagination: Pagination) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/departamento?pageNumber=${pagination.page - 1}&pageSize=${pagination.pageSize}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}

async createDepartamento(body: Departamentos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/departamento`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}

async editDepartamento(body: Departamentos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/departamento/edit`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = json;
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}    

async departamentoDelete(body: Memos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/departamento/logic-delete`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = json;
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
} 

//services for cargos
async getCargo(id: any) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo/view?id=${id}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async getAllCargos(pagination: Pagination) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo?pageNumber=${pagination.page - 1}&pageSize=${pagination.pageSize}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async createCargo(body: Cargos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}

async editCargo(body: Cargos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo/edit`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = json;
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}  

async cargoDelete(body: Memos) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo/logic-delete`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = json;
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
} 

//services for firmas
async getFirma(id: any) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/firma/view?id=${id}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async getAllFirmas(pagination: Pagination) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/firma?pageNumber=${pagination.page - 1}&pageSize=${pagination.pageSize}`, {
            method: 'get',
            headers: {
                'Authorization': this.token?.id
            }
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = [];
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async createFirma(body: Firma) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/firma`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = await json.json();
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
}
async editFirma(body: Firma) {
    let res: any;
    try {
        const json = await fetch(`${endpoint}/cargo/edit`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token?.id
            },
            body: JSON.stringify(body)
        });
        res = json;
    } catch (ex) {
        console.error(ex);
        res = null;
    } finally {
        if (res.object?.message?.error) {
            this.ui.messageError(res.object.message.error);
        }
    }
    return res;
} 


}

