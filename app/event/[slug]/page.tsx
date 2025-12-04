import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
};
const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => {
        return (
          <div className="pill" key={tag}>
            {tag}
          </div>
        );
      })}
    </div>
  );
};

const EventDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`
  );
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = await response.json();
  if (!description) {
    return notFound();
  }
  const bookings = 10;
  const smiliarEvents:IEvent[] = await getSimilarEventsBySlug(slug)

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="event banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="time" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your Spot</p>
            )}
            <BookEvent />
          </div>
          
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
            {smiliarEvents.length>0 && 
                smiliarEvents.map((event: IEvent)=>{
                    return (
                        <EventCard key={event.title} {...event}/>

                    )
                })

            
            
            }

        </div>

      </div>

    </section>
  );
};
export default EventDetail;
