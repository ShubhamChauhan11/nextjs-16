
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";


export default  async function Home() {
  'use cache';
   cacheLife('hours')
   const response= await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`)
   const {events}=await response.json()

 
 
  return (
   <section>
    <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
    <p className="text-center mt-5">Hackathons, Meetups and Confrences,  All in One Place</p>
    <ExploreBtn/>
    <div className="mt-20 space-y-7">
      <h3>Feature Events</h3>
      <ul className="events">
        {
         events && events.length>0 &&  events.map((event: IEvent)=>(
            <li className="list-type-none" key={event.title}>
              <EventCard {...event}/>
              

            </li>
          ))
        }

      </ul>
   

    </div>
   </section>
  );
}
