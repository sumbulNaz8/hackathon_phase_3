from datetime import datetime
from sqlmodel import select
from database import get_engine
from models import Task

async def test_query():
    engine = await get_engine()
    async with engine.begin() as conn:
        result = await conn.execute(select(Task).where(Task.id == 1))
        task = result.scalar_one_or_none()
        
        if task:
            print(f"Task found: {task.title}, {task.priority}")
            
            advice_messages = {
                "High": f"This is a high priority task, '{task.title}'. Finish it before noon!",
                "Medium": f"This is a medium priority task, '{task.title}'. Try to complete it today.",
                "Low": f"This is a low priority task, '{task.title}'. You can schedule it for later."
            }

            advice = advice_messages.get(task.priority, f"Complete the task '{task.title}' as per your schedule.")
            print(f"Advice: {advice}")
        else:
            print("Task not found")

# Run the test
import asyncio
asyncio.run(test_query())