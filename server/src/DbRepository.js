let fs = require('fs');
const { Client } = require('pg');

var pg_client_to = null;
var dwh_properties = [];

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://yzggczwizhgltaquqdac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Z2djendpemhnbHRhcXVxZGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzODA0MDEsImV4cCI6MjA0NTk1NjQwMX0._CTmj7Mt3BnwNiPUJi7FSHTu8gSr3z8WokFZLlcz0Hw';
const supabase = createClient(supabaseUrl, supabaseKey)
//

async function load_config() {
    try {
        let p = __dirname;
        console.log(new Date().toISOString(), 'load_config()', 'Текущая папка', p);
        let fl_settings = null;
        let fl_settings_path = null;
        if (process.platform == 'win32') {
            let p1 = p.indexOf('\\dwh\\connectors\\');
            let s = p.substring(0, p1);
            p1 = s.lastIndexOf('\\');
            s = s.substring(p1 + 1, s.length);
            fl_settings_path = 'C:\\Users\\Lumelskiy.T\\my-app\\\mycrmapp\\' + s + '\\service\\dwh.properties';
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

        pg_client_to = createClient(supabaseUrl, supabaseKey)

        
        pg_client_to = new Client({
            host: dwh_properties['db.host'],
            port: dwh_properties['db.port'],
            database: dwh_properties['db.name'],
            user: dwh_properties['db.user.login'],
            password: dwh_properties['db.user.password'],
            statement_timeout: 0
        });

        await pg_client_to.connect();
        
        //var res = await pg_conf.query('select * from test_tabl');

    }
    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'load_config()', e.stack);
        throw new Error("load_config: " + e.message);
    }
}

async function get_tickets(){
    try{  
        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }

        let select_query = 'select * from tickets'   
        
        let tickets = await pg_client_to.query(select_query);
        return tickets.rows;
       
    }
    catch(e){
        throw new Error(e);
    }
}

async function save_new_ticket(new_ticket) {
    try {

        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }
        let insert_query = `        
        insert into tickets
        (       ticketname, 
                eventstartdate,
                eventenddate, 
                nextcontactdate,
                description, 
                eventtype, 
                companyid,
                eventstatus)
        values( '` + new_ticket.ticketname + `',
                '` + new_ticket.eventstartdate + `',
                '` + new_ticket.eventenddate + `',
                '` + new_ticket.nextcontactdate + `',
                '` + new_ticket.description + `',
                '` + new_ticket.eventtype + `',
                ` + new_ticket.companyid + `,
                '` + new_ticket.eventstatus + `'); 

        `;

        await pg_client_to.query(insert_query);        
        

    }

    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_ticket()', e);
        throw new Error(e.message);
    }

}

async function save_new_company(new_company) {
    try {

        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }

        let insert_company_query = `
        insert into company
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

        if(new_company.Contacts.length > 0)
            new_company.Contacts.forEach(element => {
                let insert_contacts_query = `
                insert into contacts
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
        });
    }

    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_ticket()', e.stack);
        throw new Error(e.message);
    }

}

async function save_new_contact(contact) {
    try {

        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }
        let insert_query = `                
        insert into Contacts
        (       name, 
                familyname,
                email, 
                primaryphone,
                secondaryphone, 
                additionalphone, 
                note,
                companyid)
        values( '` + contact.name + `',
                '` + contact.familyname + `',
                '` + contact.email + `',
                '` + contact.primaryphone + `',
                '` + contact.secondaryphone + `',
                '` + contact.additionalphone + `',
                '` + contact.note + `',
                '` + contact.companyid + `'); `;

                await pg_client_to.query(insert_query);

    }
    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'save_new_contact()', e.stack);
        throw new Error(e.message);
    }

}

async function get_company_contacts(CompanyId){
    try {

        let company = Number(CompanyId);
        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }
        let select_query = `select contactid, name from contacts where companyid = ${company};`;

        let contacts = await pg_client_to.query(select_query);

        return contacts.rows;
    }
    catch(error){
        throw new Error(error);
    }

}

async function get_all_contacts() {
    try {
        let contact_obj = {};
        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }
        let select_query = `select tc.*,t.companyname from contacts tc
                             join company t on tc.companyid = t.companyid `;

        let companies_list = await pg_client_to.query('select companyid, companyname from company');

        let contacts_list = await pg_client_to.query(select_query);

        contact_obj = {
            companies_list: companies_list.rows,
            contacts_list: contacts_list.rows
        };
        


        return contact_obj.contacts_list;

    }
    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'get_all_contacts()', e.stack);
        throw new Error(e)
    }

}

async function get_companies() {
    try {

        if (!pg_client_to._connected) {
            await pg_client_to.connect();
        }
        let select_query = "select * from company";

        let company_list = await pg_client_to.query(select_query);

        return company_list.rows;

    }
    catch (e) {
        console.warn(new Date().toISOString(), 'DbRepository.js', 'get_companies()', e.stack);
        throw new Error(e)
    }


}




module.exports = {
    save_new_ticket,
    save_new_company,
    get_companies,
    get_all_contacts,
    save_new_contact,
    get_tickets,
    load_config,
    get_company_contacts
    // Другие экспортируемые функции
};