$(document).ready(function () {

    if (document.getElementById("gridClientes")) {
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true, // Enable paging
            pageSize: 5, // Set page size (default: 10)
            sorting: true, // Enable sorting
            defaultSorting: 'Nome ASC', // Set default sorting
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Nome: {
                    title: 'Nome',
                    width: '35%'
                },
                CPF: {
                    title: 'CPF',
                    width: '15%'
                },
                Email: {
                    title: 'Email',
                    width: '35%'
                },
                Alterar: {
                    title: '',
                    width: '10%',
                    sorting: false,
                    display: function (data) {
                        return '<button onclick="window.location.href=\'' + urlAlteracao + '/' + data.record.Id + '\'" class="btn btn-primary btn-sm">Alterar</button>';
                    }
                },
                Excluir: {
                    title: '',
                    width: '10%',
                    sorting: false,
                    display: function (data) {
                        return '<button onclick="excluirCliente(' + data.record.Id + ')" class="btn btn-danger btn-sm">Excluir</button>';
                    }
                }
            }
        });

        // Load client list from server
        $('#gridClientes').jtable('load');
    }
});

function excluirCliente(id) {
    if (confirm('Tem certeza de que deseja excluir este cliente?')) {
        $.ajax({
            url: urlExclusao + '/' + id,
            type: 'GET',
            success: function (response) {
                alert('Cadastro excluído com sucesso');
                $('#gridClientes').jtable('reload');
            },
            error: function (xhr, status, error) {
                alert('Erro ao excluir o cliente: ' + error);
            }
        });

    }
}
