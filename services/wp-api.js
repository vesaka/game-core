import Api from './api.js';
import axios from 'axios';
class WpApi extends Api {
    
    login(login) {
        axios.post('token')
                .then(response => {
                            const data = response.data.data || {};
                            this.$save('auth', {
                                token: data.token,
                                id: data.id,
                                username: data.nicename,
                                name: data.displayName
                            });

                            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                            this.$router.push('/play/game');
                        }).catch(e => {
                    console.log(e.response.data);
                });
    }
    
    register() {
        
    }
}

export default WpApi;


