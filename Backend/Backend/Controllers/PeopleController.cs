using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        //POST api/people {body}
        //GET api/people
        //GET api/people/{id}
        //PUT api/people/{id} {body}
        //DELETE api/people/{id}
        private readonly AppDbContext _context;

        public PeopleController(AppDbContext context)
        {
            _context = context;
        }

        //POST api/people {body}
        [HttpPost]
        public async Task<IActionResult> AddPerson(Person person)
        {
            try
            {
                _context.People.Add(person);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetPerson", new { id = person.Id }, person);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //PUT api/people/{id} {body}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePerson(int id, [FromBody] Person person)
        {
            try
            {
                if (id != person.Id)
                {
                    return BadRequest("Person ID mismatch");
                }
                if (await _context.People.AnyAsync(p => p.Id == id) is false)
                {
                    return NotFound();
                }
                _context.People.Update(person);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //GET api/people
        [HttpGet]
        public async Task<IActionResult> GetPeople()
        {
            try
            {
                var people = await _context.People.ToListAsync();
                return Ok(people);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //GET api/people/{id}
        [HttpGet("{id:int}", Name = "GetPerson")]
        public async Task<IActionResult> GetPerson(int id)
        {
            try
            {
                var person = await _context.People.FindAsync(id);
                if (person is null)
                {
                    return NotFound();
                }
                return Ok(person);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        //DELETE api/people/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            try
            {
                var person = await _context.People.FindAsync(id);
                if (person is null)
                {
                    return NotFound();
                }
                _context.People.Remove(person);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       
    }
}

//We have to enable cors request in Program.cs file:
/*
    our server application listening on port http://localhost:5140
    our client application(Javascript) listening on port http://localhost:5173

    if we try to make a request from client application to server application
    the browser will block the request because of cors policy : CORS : Cross Origin Resource Sharing
    because the port number is different
    So we have to enable cors request from port 5173 to 5140
 */