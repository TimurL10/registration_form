let fs = require('fs');
const { Client } = require('pg');

var pg_client_to = null;
var dwh_properties = [];




async function load_config() {
    try {
        let p = __dirname;
        console.log(new Date().toISOString(), 'WEO.js', 'load_config()', 'Текущая папка', p);
        let fl_settings = null;
        let fl_settings_path = null;
        if (process.platform == 'win32') {
            let p1 = p.indexOf('\\dwh\\connectors\\');
            let s = p.substring(0, p1);
            p1 = s.lastIndexOf('\\');
            s = s.substring(p1 + 1, s.length);
            fl_settings_path = 'C:\\Users\\Lumelskiy.T\\my-app\\' + s + '\\service\\dwh.properties';
        }
        console.log(new Date().toISOString(), 'dbRepository.js', 'load_config()', 'Путь к файлу dwh.properties', fl_settings_path);
        fl_settings = fs.readFileSync(fl_settings_path);
        fl_settings = fl_settings.toString().split('\n');
        for (var r in fl_settings) {
            let s = fl_settings[r];
            s = s.trim();
            if (s.length > 0) {
                p = s.indexOf('=');
                dwh_properties[s.substring(0, p)] = s.substring(p + 1, s.length);
            };
        };

        pg_client_to = new Client({
            host: dwh_properties['db.host'],
            port: dwh_properties['db.port'],
            database: dwh_properties['db.name'],
            user: dwh_properties['db.user.login'],
            password: dwh_properties['db.user.password'],
        });

        await pg_client_to.connect();
        //var res = await pg_conf.query('select * from test_tabl');
       
    }
    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'load_config()', e.stack);
        throw new Error("load_config: " + e.message);
    }
}


async function save_new_ticket(new_ticket){
    try {
        
        if (!pg_client_to._connected){
            await pg_client_to.connect(); 
        }
        let insert_query = `
        do
        $$
        declare
            rows_inserted int;
        begin
        insert into test_tickets
        (       TicketName, 
                EventStartDate,
                EventEndDate, 
                NextContactDate,
                description, 
                EventType, 
                CompanyId,
                EventStatus)
        values( '` + new_ticket.TicketName + `',
                ` + new_ticket.EventStartDate + `,
                ` + new_ticket.EventEndDate + `,
                ` + new_ticket.NextContactDate + `,
                '` + new_ticket.description + `',
                ` + new_ticket.EventType + `,
                ` + new_ticket.CompanyId + `,
                ` + new_ticket.EventStatus + `); 

        GET DIAGNOSTICS rows_inserted = ROW_COUNT; 

        drop table if exists temp_crm_info;
        create temp table temp_crm_info as 
        select rows_inserted;                           

        end;
        $$;

        select rows_inserted from temp_crm_info;`;     
        
        await pg_client_to.query(insert_query);

    }

    catch(e){
        console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_ticket()', e.stack);
        throw new Error(e.message);
    }

}

async function save_new_company(new_company){
    try {
        
        if (!pg_client_to._connected){
            await pg_client_to.connect(); 
        }

        let insert_company_query = `
        insert into test_company
        (companyname, companydescription, companyphone, companyemail, companywebsite, companyaddress)
        values( '` + new_company["CompanyName"] + `',
                '` + new_company["CompanyDescription"] + `',
                '` + new_company["CompanyPhone"] + `',
                '` + new_company["CompanyEmail"] + `',
                '` + new_company["CompanyWebSite"] + `',
                '` + new_company["CompanyAddress"] + `')
                RETURNING CompanyId; `;     
        
        let AddedCompanyId = await pg_client_to.query(insert_company_query);
        console.log(AddedCompanyId.rows[0].companyid)

        new_company.Contacts.forEach(element => {
            let insert_contacts_query = `
            insert into test_contact
            (Name,FamilyName,Email,PrimaryPhone,SecondaryPhone,AdditionalPhone,Note,CompanyId)
            values( '` + element["Name"] + `',
                    '` + element["FamilyName"] + `',
                    '` + element["Email"] + `',
                    '` + element["PrimaryPhone"] + `',
                    '` + element["SecondaryPhone"] + `',
                    '` + element["AdditionalPhone"] + `',
                    '` + element["Note"] + `',
                    '` + AddedCompanyId.rows[0].companyid + `'); `; 

            pg_client_to.query(insert_contacts_query);
        
        })
            
        
        async function save_new_contact(contact){
            try {
                
                if (!pg_client_to._connected){
                    await pg_client_to.connect(); 
                }
                let insert_query = `                
                insert into test_tickets
                (       name, 
                        familyname,
                        email, 
                        primaryphone,
                        secondaryphone, 
                        additionalphone, 
                        note,
                        companyid)
                values( '` + contact.name + `',
                        ` + contact.familyname + `,
                        ` + contact.email + `,
                        ` + contact.primaryphone + `,
                        '` + contact.secondaryphone + `',
                        ` + contact.additionalphone + `,
                        ` + contact.note + `,
                        ` + contact.companyid + `); `;     
                
                await pg_client_to.query(insert_query);
        
            }
        
            catch(e){
                console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_contact()', e.stack);
                throw new Error(e.message);
            }
        
        }    


        

    }

    catch(e){
        console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_ticket()', e.stack);
        throw new Error(e.message);
    }

}

async function get_companies() {
    try{

        if (!pg_client_to._connected){
            await pg_client_to.connect(); 
        }
        let select_query = "select * from test_company";   
        
        let company_list = await pg_client_to.query(select_query);

        return company_list.rows;

    }
    catch(e){
        console.warn(new Date().toISOString(), 'DbRepository.js', 'get_companies()', e.stack);
        throw new Error (e)
    }

    
}

async function get_all_contacts() {
    try{

        if (!pg_client_to._connected){
            await pg_client_to.connect(); 
        }
        let select_query = `select tc.*,t.companyname from test_contact tc
                             join test_company t on tc.companyid = t.companyid `;   
        
        let contacts_list = await pg_client_to.query(select_query);

        return contacts_list.rows;

    }
    catch(e){
        console.warn(new Date().toISOString(), 'DbRepository.js', 'get_all_contacts()', e.stack);
        throw new Error (e)
    }

    
}




module.exports = {
    load_config,
    save_new_ticket,
    save_new_company,
    get_companies,
    get_all_contacts
    // Другие экспортируемые функции
};